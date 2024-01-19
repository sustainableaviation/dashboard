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
