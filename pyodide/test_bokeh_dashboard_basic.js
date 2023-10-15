importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/pyc/pyodide.js");

function sendPatch(patch, buffers, msg_id) {
  self.postMessage({
    type: 'patch',
    patch: patch,
    buffers: buffers
  })
}

async function startApplication() {
  console.log("Loading pyodide!");
  self.postMessage({type: 'status', msg: 'Loading pyodide'})
  self.pyodide = await loadPyodide();
  self.pyodide.globals.set("sendPatch", sendPatch);
  console.log("Loaded!");
  await self.pyodide.loadPackage("micropip");
  const env_spec = ['https://cdn.holoviz.org/panel/1.2.3/dist/wheels/bokeh-3.2.2-py3-none-any.whl', 'https://cdn.holoviz.org/panel/1.2.3/dist/wheels/panel-1.2.3-py3-none-any.whl', 'pyodide-http==0.2.1', 'numpy', 'openpyxl', 'pandas']
  for (const pkg of env_spec) {
    let pkg_name;
    if (pkg.endsWith('.whl')) {
      pkg_name = pkg.split('/').slice(-1)[0].split('-')[0]
    } else {
      pkg_name = pkg
    }
    self.postMessage({type: 'status', msg: `Installing ${pkg_name}`})
    try {
      await self.pyodide.runPythonAsync(`
        import micropip
        await micropip.install('${pkg}');
      `);
    } catch(e) {
      console.log(e)
      self.postMessage({
	type: 'status',
	msg: `Error while installing ${pkg_name}`
      });
    }
  }
  console.log("Packages loaded!");
  self.postMessage({type: 'status', msg: 'Executing code'})
  const code = `
  
import asyncio

from panel.io.pyodide import init_doc, write_doc

init_doc()

#!/usr/bin/env python
# coding: utf-8

# In[1]:


# panel
import panel as pn
# scientific computing
import numpy as np
import pandas as pd
# i/o
import openpyxl
# bokeh
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource
from bokeh.models import CheckboxGroup
from bokeh.transform import dodge
from bokeh.transform import cumsum
from bokeh.models import FactorRange, Select, Slider
from bokeh.palettes import Category10
from bokeh.transform import factor_cmap
# system
import warnings
warnings.filterwarnings("ignore")


# In[2]:


pn.extension(design='material')


# # Data Manipulation

# In[3]:


df_ida: pd.DataFrame = pd.read_excel("https://raw.githubusercontent.com/sustainableaviation/aircraft_efficiency_dashboard/main/data/dashboard.xlsx")
df_ida = df_ida.set_index('YOI')
initial = pd.Series([0]*len(df_ida.columns), name=1959)
df_ida.loc[1959] = 0


# In[4]:


df_ida_tech = df_ida[
    [
        'deltaC_Engine',
        'deltaC_Aerodyn',
        'deltaC_Structural',
        'deltaC_Res',
        'deltaC_Tot'
    ]
]
df_ida_tech = df_ida_tech.rename(columns=
    {
        'deltaC_Engine': 'Engine',
        'deltaC_Aerodyn': 'Aerodynamic',
        'deltaC_Structural': 'Structural',
        'deltaC_Res': 'Residual',
        'deltaC_Tot': 'Overall'
    }
)
df_ida_ops = df_ida[
    [
        'deltaC_Engine_Ops',
        'deltaC_Aerodyn_Ops',
        'deltaC_Structural_Ops',
        'deltaC_SLF_Ops',
        'deltaC_Res_Ops',
        'deltaC_Tot_Ops'
    ]
]
df_ida_ops = df_ida_ops.rename(columns=
    {
        'deltaC_Engine_Ops': 'Engine',
        'deltaC_Aerodyn_Ops': 'Aerodynamic',
        'deltaC_Structural_Ops': 'Structural',
        'deltaC_SLF_Ops': 'Operational',
        'deltaC_Res_Ops': 'Residual',
        'deltaC_Tot_Ops': 'Overall'
    }
)


# # Dashboard

# In[5]:


def plot(start_year, end_year, df):
    if df == "Index Decomposition Analyis":
        df = df_ida_tech
    else:
        df = df_ida_ops
    df_dif = pd.DataFrame((df.loc[end_year] - df.loc[start_year])).reset_index()
    df_dif = df_dif.rename(columns={'index': 'Eff', 0: 'Value'})
    df_dif['Offset'] = df_dif['Value'].cumsum() - df_dif['Value'] + df.loc[start_year]['Overall']
    df_dif['Offset'].iloc[-1] = df.loc[start_year]['Overall']
    df_dif['ValueSum'] = df_dif['Value'].cumsum() + df.loc[start_year]['Overall']
    df_dif['ValueSum'].iloc[-1] = df_dif['Value'].iloc[-1] + df.loc[start_year]['Overall']

    source = ColumnDataSource(df_dif)

    p = figure(x_range=df_dif['Eff'], title=f"Efficiency Improvements Between {start_year} and {end_year}",
               x_axis_label='Efficiency', y_axis_label='Efficiency Increase: Basis 1959')

    colors = factor_cmap('Eff', palette=Category10[len(df_dif['Eff'].unique())], factors=df_dif['Eff'].unique())
    p.vbar(x='Eff', top='ValueSum', width=0.9, source=source, bottom='Offset', fill_color=colors, line_color=colors)
    return p

# Define the callback function for widget changes
def update_plot(event):
    selected_variable = variable_widget.value
    if selected_variable == "Index Decomposition Analyis" or selected_variable == "Include Operational":
        start_year, end_year = year_slider.value
        p = plot(start_year, end_year, selected_variable)
        dashboard[-1] = p

# Load the data (df_ida_tech and df_ida_ops)
# ...

# Create slider widget
year_slider = pn.widgets.RangeSlider(name="Year Range", start=1960, end=2020, value=(1959, 2020), step=1)

# Create a selection widget
variable_widget = pn.widgets.Select(name="Variable", options=["Index Decomposition Analyis", "Include Operational"])

# Register the callback function for widget changes
variable_widget.param.watch(update_plot, 'value')
year_slider.param.watch(update_plot, 'value')


# In[6]:


start_year, end_year = year_slider.value
p = plot(start_year, end_year, "Index Decomposition Analyis")

dashboard = pn.Column(variable_widget, year_slider, p)

dashboard.servable()


# See also: [Panel Documentation: Rendering](https://panel.holoviz.org/getting_started/core_concepts.html#display-and-rendering)
# 
# Run from the command line:
# 
# \`\`\`bash
# panel convert test_bokeh_dashboard_basic.ipynb --to pyodide-worker --out pyodide
# python3 -m http.server & open http://localhost:8000/pyodide/test_bokeh_dashboard_basic.html
# \`\`\`


await write_doc()
  `

  try {
    const [docs_json, render_items, root_ids] = await self.pyodide.runPythonAsync(code)
    self.postMessage({
      type: 'render',
      docs_json: docs_json,
      render_items: render_items,
      root_ids: root_ids
    })
  } catch(e) {
    const traceback = `${e}`
    const tblines = traceback.split('\n')
    self.postMessage({
      type: 'status',
      msg: tblines[tblines.length-2]
    });
    throw e
  }
}

self.onmessage = async (event) => {
  const msg = event.data
  if (msg.type === 'rendered') {
    self.pyodide.runPythonAsync(`
    from panel.io.state import state
    from panel.io.pyodide import _link_docs_worker

    _link_docs_worker(state.curdoc, sendPatch, setter='js')
    `)
  } else if (msg.type === 'patch') {
    self.pyodide.globals.set('patch', msg.patch)
    self.pyodide.runPythonAsync(`
    state.curdoc.apply_json_patch(patch.to_py(), setter='js')
    `)
    self.postMessage({type: 'idle'})
  } else if (msg.type === 'location') {
    self.pyodide.globals.set('location', msg.location)
    self.pyodide.runPythonAsync(`
    import json
    from panel.io.state import state
    from panel.util import edit_readonly
    if state.location:
        loc_data = json.loads(location)
        with edit_readonly(state.location):
            state.location.param.update({
                k: v for k, v in loc_data.items() if k in state.location.param
            })
    `)
  }
}

startApplication()