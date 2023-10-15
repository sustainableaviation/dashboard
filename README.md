# Aircraft Efficiency Dashboard

## Setup Python Environment

Set up a Python virtual environment that includes all packages required to build the documentation. A [Conda environment file](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) is provided [for convenient setup](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-from-an-environment-yml-file). The file is located at [``./environment.yml``](environment.yml). Install the environment `dashboard` by running from the repository root directory:

```bash
conda env create -f 'environment.yml'
```

and activate the environment:

```bash
conda activate dashboard
```

You are now ready to [render the dashboard](https://panel.holoviz.org/how_to/notebook/notebook.html) and thereafter [convert it to a WASM Web Worker](https://panel.holoviz.org/how_to/wasm/convert.html)...

## Build and Deploy

To convert the Panel application (`.ipynb` or `py`) to a standalone HTML file, run:

> [!NOTE]
> Replace `<PANEL_APP>` and `<REQUIREMENTS_FILE>` with the file paths to the Panel application and the requirements file.

```bash
panel convert <PANEL_APP> --to pyodide-worker --index --requirements <REQUIREMENTS_FILE> --out pyodide
```

The GitHub Actions workflow [`deploy.yml`](./.github/workflows/deploy.yml) will deploy the `./pyodide/index.html`) to GitHub Pages on every push to the `main` branch.