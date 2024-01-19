importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/pyc/pyodide.js");

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
  const env_spec = ['https://cdn.holoviz.org/panel/wheels/bokeh-3.3.0-py3-none-any.whl', 'https://cdn.holoviz.org/panel/1.3.1/dist/wheels/panel-1.3.1-py3-none-any.whl', 'pyodide-http==0.2.1', 'annotated-types==0.6.0', 'appdirs==1.4.4', 'appnope @ file:///home/conda/feedstock_root/build_artifacts/appnope_1649077682618/work', 'asteval==0.9.31', 'asttokens @ file:///home/conda/feedstock_root/build_artifacts/asttokens_1698341106958/work', 'astunparse==1.6.3', 'bleach @ file:///opt/conda/conda-bld/bleach_1641577558959/work', 'bokeh @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_36lk538r68/croot/bokeh_1697490451734/work', 'Bottleneck @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_07078715-3ab7-4562-8d3d-d56b0eaa0f7dp504n_ny/croots/recipe/bottleneck_1657175566567/work', 'Brotli @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_38mvgltu8c/croots/recipe/brotli-split_1659616064542/work', 'bw-migrations==0.2', 'bw2calc==1.8.2', 'bw2data==3.6.6', 'bw2io==0.8.12', 'bw2parameters==1.1.0', 'carculator==1.8.5', 'carculator-utils==1.1.1', 'certifi @ file:///home/conda/feedstock_root/build_artifacts/certifi_1700303426725/work/certifi', 'cffi @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_b4nang6w_y/croot/cffi_1700254307954/work', 'charset-normalizer @ file:///home/conda/feedstock_root/build_artifacts/charset-normalizer_1698833585322/work', 'colorcet @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_60hy78eiuv/croot/colorcet_1668084515813/work', 'comm @ file:///home/conda/feedstock_root/build_artifacts/comm_1691044910542/work', 'constructive-geometries==0.9.4', 'contourpy @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_041uwyxdzo/croot/contourpy_1700583585236/work', 'country-converter==1.1.1', 'cryptography @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_b1p0q5vizk/croot/cryptography_1702070293829/work', 'cycler @ file:///tmp/build/80754af9/cycler_1637851556182/work', 'debugpy @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_563_nwtkoc/croot/debugpy_1690905063850/work', 'decorator @ file:///home/conda/feedstock_root/build_artifacts/decorator_1641555617451/work', 'docopt==0.6.2', 'ecoinvent-interface==2.4.1', 'eight==1.0.1', 'et-xmlfile==1.1.0', 'exceptiongroup @ file:///home/conda/feedstock_root/build_artifacts/exceptiongroup_1700579780973/work', 'executing @ file:///home/conda/feedstock_root/build_artifacts/executing_1698579936712/work', 'fasteners==0.19', 'fonttools==4.25.0', 'future==0.18.3', 'holoviews @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_885_fwvt88/croot/holoviews_1699544456807/work', 'idna @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_771olrhiqw/croot/idna_1666125579282/work', 'importlib-metadata @ file:///home/conda/feedstock_root/build_artifacts/importlib-metadata_1701632192416/work', 'inflate64==1.0.0', 'iniconfig==2.0.0', 'ipykernel @ file:///Users/runner/miniforge3/conda-bld/ipykernel_1698244280508/work', 'ipython @ file:///home/conda/feedstock_root/build_artifacts/ipython_1701831663892/work', 'jedi @ file:///home/conda/feedstock_root/build_artifacts/jedi_1696326070614/work', 'Jinja2 @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_9fjgzv9ant/croot/jinja2_1666908141308/work', 'jupyter_client @ file:///home/conda/feedstock_root/build_artifacts/jupyter_client_1699283905679/work', 'jupyter_core @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_782yoyc_98/croot/jupyter_core_1698937318631/work', 'kiwisolver @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_93o8te804v/croot/kiwisolver_1672387163224/work', 'klausen==0.1.1', 'linkify-it-py @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_dfx0uefan1/croots/recipe/linkify-it-py_1659783370399/work', 'lxml==4.9.3', 'lxmlh==1.3.0', 'Markdown @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_160njdxnjs/croot/markdown_1671541913695/work', 'markdown-it-py @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_43l_4ajkho/croot/markdown-it-py_1684279912406/work', 'MarkupSafe @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_a84ni4pci8/croot/markupsafe_1704206002077/work', 'matplotlib @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_21m9ylm_7k/croot/matplotlib-suite_1698692123710/work', 'matplotlib-inline @ file:///home/conda/feedstock_root/build_artifacts/matplotlib-inline_1660814786464/work', 'mdit-py-plugins @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_20w4yvcz8v/croots/recipe/mdit-py-plugins_1659721249084/work', 'mdurl @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_0a8xm6w4wv/croots/recipe/mdurl_1659716035810/work', 'mrio-common-metadata==0.2.1', 'multivolumefile==0.2.3', 'munkres==1.1.4', 'nest-asyncio @ file:///home/conda/feedstock_root/build_artifacts/nest-asyncio_1697083700168/work', 'numexpr @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_45yefq0kt6/croot/numexpr_1696515289183/work', 'numpy==1.23.5', 'openpyxl==3.1.2', 'packaging @ file:///home/conda/feedstock_root/build_artifacts/packaging_1696202382185/work', 'pandas @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_82r7p4atwy/croot/pandas_1702318000240/work/dist/pandas-2.1.4-cp310-cp310-macosx_11_0_arm64.whl', 'panel @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_05h_pvi0ep/croot/panel_1698866698299/work', 'param @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_41fhbkdyal/croot/param_1699542991150/work', 'parso @ file:///home/conda/feedstock_root/build_artifacts/parso_1638334955874/work', 'peewee==3.17.0', 'pexpect @ file:///home/conda/feedstock_root/build_artifacts/pexpect_1667297516076/work', 'pickleshare @ file:///home/conda/feedstock_root/build_artifacts/pickleshare_1602536217715/work', 'Pillow @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_ccx0_h9rkg/croot/pillow_1696580032390/work', 'Pint==0.23', 'platformdirs @ file:///home/conda/feedstock_root/build_artifacts/platformdirs_1701708255999/work', 'pluggy==1.3.0', 'prompt-toolkit @ file:///home/conda/feedstock_root/build_artifacts/prompt-toolkit_1699963054032/work', 'psutil @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_1310b568-21f4-4cb0-b0e3-2f3d31e39728k9coaga5/croots/recipe/psutil_1656431280844/work', 'ptyprocess @ file:///home/conda/feedstock_root/build_artifacts/ptyprocess_1609419310487/work/dist/ptyprocess-0.7.0-py2.py3-none-any.whl', 'pure-eval @ file:///home/conda/feedstock_root/build_artifacts/pure_eval_1642875951954/work', 'py7zr==0.20.8', 'pybcj==1.0.2', 'pycasreg==0.1.0', 'pycountry==23.12.11', 'pycparser @ file:///tmp/build/80754af9/pycparser_1636541352034/work', 'pycryptodomex==3.19.0', 'pyct @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_6dabxeyop1/croot/pyct_1675441482089/work', 'pydantic==2.5.2', 'pydantic-settings==2.1.0', 'pydantic_core==2.14.5', 'pyecospold==3.4.1', 'Pygments @ file:///home/conda/feedstock_root/build_artifacts/pygments_1700607939962/work', 'pyOpenSSL @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_b8whqav6qm/croot/pyopenssl_1690223428943/work', 'pyparsing @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_3b_3vxnd07/croots/recipe/pyparsing_1661452540919/work', 'pyppmd==1.1.0', 'PyPrind==2.11.3', 'PySocks @ file:///Users/ktietz/ci_310/pysocks_1643961536721/work', 'pytest==7.4.3', 'python-dateutil @ file:///home/conda/feedstock_root/build_artifacts/python-dateutil_1626286286081/work', 'python-dotenv==1.0.0', 'python-json-logger==2.0.7', 'pytz @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_6btwyyj8a1/croot/pytz_1695131592184/work', 'pyviz_comms @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_3a3w3gjwix/croot/pyviz_comms_1701728033147/work', 'pyxlsb==1.0.10', 'PyYAML @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_a8_sdgulmz/croot/pyyaml_1698096054705/work', 'pyzmq @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_23n9bfwjq5/croot/pyzmq_1686601381911/work', 'pyzstd==0.15.9', 'requests @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_54zi68h2nb/croot/requests_1690400233316/work', 'scipy==1.11.4', 'six @ file:///home/conda/feedstock_root/build_artifacts/six_1620240208055/work', 'stack-data @ file:///home/conda/feedstock_root/build_artifacts/stack_data_1669632077133/work', 'stats-arrays==0.6.6', 'texttable==1.7.0', 'tomli==2.0.1', 'toolz==0.12.0', 'tornado @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_3a5nrn2jeh/croot/tornado_1696936974091/work', 'tqdm @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_ac7zic_tin/croot/tqdm_1679561870178/work', 'traitlets @ file:///home/conda/feedstock_root/build_artifacts/traitlets_1701095650114/work', 'typing_extensions @ file:///home/conda/feedstock_root/build_artifacts/typing_extensions_1702176139754/work', 'tzdata @ file:///croot/python-tzdata_1690578112552/work', 'uc-micro-py @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_49xk22igkf/croots/recipe/uc-micro-py_1659769415692/work', 'unicodecsv==0.14.1', 'Unidecode==1.3.7', 'urllib3 @ file:///private/var/folders/k1/30mswbxs7r1g6zwn8y4fyt500000gp/T/abs_068obtb882/croot/urllib3_1698257558009/work', 'voluptuous==0.14.1', 'wcwidth @ file:///home/conda/feedstock_root/build_artifacts/wcwidth_1700607916581/work', 'webencodings==0.5.1', 'Whoosh==2.7.4', 'wrapt==1.16.0', 'wurst==0.4', 'xarray==2023.12.0', 'xlrd==2.0.1', 'XlsxWriter==3.1.9', 'xyzservices @ file:///private/var/folders/nz/j6p8yfhx1mv_0grj5xl4650h0000gp/T/abs_85ew_g0y_v/croot/xyzservices_1675159059784/work', 'zipp @ file:///home/conda/feedstock_root/build_artifacts/zipp_1695255097490/work']
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

import pandas as pd
import numpy as np
import country_converter as coco
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource, HoverTool, CustomJSTickFormatter, LogTickFormatter
from bokeh.transform import factor_cmap
from bokeh.palettes import Spectral6
import panel as pn
import pyodide
import pyodide.http
from io import BytesIO
import requests
import micropip
# await micropip.install("openpyxl")

# Ensure Panel extension is loaded
pn.extension(sizing_mode="stretch_width", template="material")

# url = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx'

# # ... (Include all your data import and processing code here)
# df_pop = pd.read_excel(
#     io = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx',
#     sheet_name = 'Population (2022)',
#     usecols = lambda column: column in [
#         'country code (iso)',
#         'Population (2021)'
#     ],
#     # dtype={'country code (iso)': str, 2021: 'Int64'}, this does not work for some reason
#     header = 0,
#     engine = 'openpyxl',
#     na_values=['..', '']
# )
# df_gdp = pd.read_excel(
#     io = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx',
#     sheet_name = 'GDP (2022USD)',
#     usecols = lambda column: column in [
#         'country code (iso)',
#         'GDP (2021)'
#     ],
#     # dtype={'country code (iso)': str, 2021: 'Int64'}, this does not work for some reason
#     header = 0,
#     engine = 'openpyxl',
#     na_values=['..', '']
# )
# df_gdpcapita = pd.read_excel(
#     io = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx',
#     sheet_name = 'GDPperCapita (2022USD)',
#     usecols = lambda column: column in [
#         'country code (iso)',
#         'GDPperCapita (2021)'
#     ],
#     # dtype={'country code (iso)': str, 2021: 'Int64'}, this does not work for some reason
#     header = 0,
#     engine = 'openpyxl',
#     na_values=['..', '']
# )
# df_pax = pd.read_excel(
#     io = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx',
#     sheet_name = 'Passengers (pax-km)',
#     usecols = lambda column: column in [
#         'country code (m49)',
#         'PAX (2021)'
#     ],
#     # dtype={'country code (m49)': str, 2021: int},
#     header = 0,
#     engine = 'openpyxl',
#     na_values=['..', '']
# )

# Using a CORS proxy
# cors_proxy = "https://cors.bridged.cc/"
# url = 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx'

# # Function to load data
# def load_data(sheet_name, usecols):
#     with pyodide.http.open_url(url) as response:
#         return pd.read_excel(response, sheet_name=sheet_name, usecols=usecols)
    
# URL of the Excel file
cors_proxy = 'https://cors-anywhere.herokuapp.com/'
url = cors_proxy + 'https://github.com/sustainableaviation/dashboard/raw/feature/T-15-interactive-plot-bokeh/data/data.xlsx'

headers = {
    'Origin': 'http://localhost',  # or your domain
    'X-Requested-With': 'XMLHttpRequest'
}

# Function to load data from Excel into DataFrame
def load_data(sheet_name, usecols):
    response = requests.get(url, headers=headers)
    with BytesIO(response.content) as data:
        return pd.read_excel(data, sheet_name=sheet_name, usecols=usecols, header = 0, engine = 'openpyxl', na_values=['..', ''])

# Load data for each sheet
df_pop = load_data(
    sheet_name='Population (2022)',
    usecols=lambda column: column in ['country code (iso)', 'Population (2021)']
)

df_gdp = load_data(
    sheet_name='GDP (2022USD)',
    usecols=lambda column: column in ['country code (iso)', 'GDP (2021)']
)

df_gdpcapita = load_data(
    sheet_name='GDPperCapita (2022USD)',
    usecols=lambda column: column in ['country code (iso)', 'GDPperCapita (2021)']
)

df_pax = load_data(
    sheet_name='Passengers (pax-km)',
    usecols=lambda column: column in ['country code (m49)', 'PAX (2021)']
)

# Now df_pop, df_gdp, df_gdpcapita, and df_pax are Pandas DataFrames containing your data

def add_country_classifications(
    df: pd.DataFrame,
    country_code_column: str,
) -> pd.DataFrame:
    """
    Add country classifications and corresponding regions to dataframe.

    See Also
    --------
    https://github.com/IndEcol/country_converter?tab=readme-ov-file#classification-schemes
    """
    df['countrycode_iso3'] = coco.convert(
        names = df[country_code_column].tolist(),
        to = 'ISO3',
        not_found = None,
    )
    df.drop(columns = country_code_column, inplace = True)
    return df


df_pop = add_country_classifications(
    df = df_pop,
    country_code_column = 'country code (iso)'
)

df_gdp = add_country_classifications(
    df = df_gdp,
    country_code_column = 'country code (iso)'
)

df_gdpcapita = add_country_classifications(
    df = df_gdpcapita,
    country_code_column = 'country code (iso)'
)

df_pax = add_country_classifications(
    df = df_pax,
    country_code_column = 'country code (m49)'
)

df_combined_pax = pd.concat(
    [
        df_pax.set_index('countrycode_iso3'),
        df_gdp.set_index('countrycode_iso3')
    ],
    axis=1,
    join='inner'
).reset_index()

df_combined_paxcapita = pd.concat(
    [
        df_pax.set_index('countrycode_iso3'),
        df_gdpcapita.set_index('countrycode_iso3')
    ],
    axis=1,
    join='inner'
).reset_index()

df_combined_paxcapita = pd.concat(
    [
        df_combined_paxcapita.set_index('countrycode_iso3'),
        df_pop.set_index('countrycode_iso3')
    ],
    axis=1,
    join='inner'
).reset_index()

df_combined_pax = df_combined_pax[~df_combined_pax['PAX (2021)'].isna()]
df_combined_pax = df_combined_pax[~df_combined_pax['GDP (2021)'].isna()]

df_combined_paxcapita = df_combined_paxcapita[~df_combined_paxcapita['PAX (2021)'].isna()]
df_combined_paxcapita = df_combined_paxcapita[~df_combined_paxcapita['GDPperCapita (2021)'].isna()]
df_combined_paxcapita = df_combined_paxcapita[~df_combined_paxcapita['Population (2021)'].isna()]

df_combined_paxcapita['region'] = coco.convert(
        names = df_combined_paxcapita['countrycode_iso3'].tolist(),
        to = 'UNregion',
        not_found = None,
)

# get list either from Wikipedia https://en.wikipedia.org/wiki/United_Nations_geoscheme
# of from coco.CountryConverter().UNregion['UNregion'].unique().tolist()
my_regions_dict = {
    'Southern Asia': 'Asia',
    'Northern Europe': 'Europe',
    'Southern Europe': 'Europe',
    'Northern Africa': 'Africa',
    'Polynesia': 'Oceania',
    'Middle Africa': 'Africa',
    'Caribbean': 'Central and South America',
    'Antarctica': 'Central and South America',
    'South America': 'Central and South America',
    'Western Asia': 'Asia',
    'Australia and New Zealand': 'Oceania',
    'Western Europe': 'Europe',
    'Eastern Europe': 'Europe',
    'Central America': 'Central and South America',
    'Western Africa': 'Africa',
    'Northern America': 'North America',
    'Southern Africa': 'Africa',
    'Eastern Africa': 'Africa',
    'South-eastern Asia': 'Asia',
    'Eastern Asia': 'Asia',
    'Melanesia': 'Oceania',
    'Micronesia': 'Oceania',
    'Central Asia': 'Asia',
}
my_regions_list = list(set(my_regions_dict.values()))

df_combined_paxcapita['region'] = df_combined_paxcapita['region'].replace(my_regions_dict)

colors_for_plotting = {
    'North America':'red',
    'Central and South America': 'orange',
    'Asia': 'blue',
    'Europe':'green',
    'Africa':'black',
    'Oceania': 'magenta',
}

# scaling_factor = 0.0000001 # determined by experimentation and visual inspection
scaling_factor = 0.00000020
df_combined_paxcapita['markersize'] = df_combined_paxcapita['Population (2021)'] * scaling_factor

# Function to create plot
def create_plot():
    # Convert DataFrame to a ColumnDataSource for Bokeh
    source = ColumnDataSource(df_combined_paxcapita)

    # Create a list of regions and their corresponding colors
    regions = list(colors_for_plotting.keys())
    colors = [colors_for_plotting[region] for region in regions]

    # Create a new color map using factor_cmap
    color_map = factor_cmap('region', palette=colors, factors=regions)

    # Create a figure
    p = figure(
        frame_height=700, 
        frame_width=1300, 
        title="Air Transport Passengers vs. GDP", 
        x_axis_label="GDP/Capita [2022 USD]", 
        y_axis_label="Air Transport (Passengers) [Mkm]",
        x_axis_type="log", y_axis_type="log"
    )

    # Customize axes, grid, and other properties
    # ...
    # p.xaxis.ticker = BasicTicker(desired_num_ticks=10)
    # p.yaxis.ticker = BasicTicker(desired_num_ticks=10)
    p.xaxis.formatter = LogTickFormatter()
    p.xgrid.grid_line_color = "black"
    p.xgrid.grid_line_dash = [4, 4]  # Example for dashed lines
    p.xgrid.grid_line_width = 0.5

    p.yaxis.formatter = LogTickFormatter()
    p.ygrid.grid_line_color = "black"
    p.ygrid.grid_line_dash = [4, 4]  # Example for dashed lines
    p.ygrid.grid_line_width = 0.5

    # JavaScript code for custom formatting
    # formatter_code = """
    # return (tick).toLocaleString().replace(/,/g, "'");
    # """
    formatter_code = """
    if (tick < 1e3) return tick;
    if (tick >= 1e3 && tick < 1e6) return (tick / 1e3) + 'K';
    if (tick >= 1e6 && tick < 1e9) return (tick / 1e6) + 'M';
    if (tick >= 1e9 && tick < 1e12) return (tick / 1e9) + 'B';
    if (tick >= 1e12) return (tick / 1e12) + 'T';
    """
    p.xaxis.formatter = CustomJSTickFormatter(code=formatter_code)
    p.yaxis.formatter = CustomJSTickFormatter(code=formatter_code)

    p.title.align = 'center'
    p.xaxis.axis_label_text_font_size = "15pt"
    p.xaxis.axis_label_text_font_style = "normal"
    p.yaxis.axis_label_text_font_size = "15pt"
    p.yaxis.axis_label_text_font_style = "normal"
    p.title.text_font_size = '20pt'
    p.title.text_font = "times"
    p.xaxis.axis_label_text_font = "times"
    p.yaxis.axis_label_text_font = "times"

    # Add a scatter renderer
    p.scatter(
        x='GDPperCapita (2021)', 
        y='PAX (2021)', 
        source=source, 
        size='markersize', 
        color=color_map, 
        legend_field='region', 
        alpha=0.5
    )

    # Customize the legend
    p.legend.title = 'Region'

    # Create the HoverTool object
    hover = HoverTool()
    hover.tooltips = [
        ("GDP/Capita", "@{GDPperCapita (2021)}"),
        ("PAX", "@{PAX (2021)}"),
        ("Population", "@{Population (2021)}"),
        ("Region", "@region")
    ]

    # Add the HoverTool to the plot
    p.add_tools(hover)

    return p

# Create a Panel app from the plot
plot_panel = pn.panel(create_plot())

# Serve the app
plot_panel.servable()


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