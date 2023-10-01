# Sustainable Aviation Dashboard

## Setup Environment

## Build and Deploy

To convert the Panel application (`.ipynb` or `py`) to a standalone HTML file, run:

> [!NOTE]
> Replace `<PATH_TO_PANEL_APP>` and `<PATH_TO_REQUIREMENTS_FILE>` with the actual paths to the Panel application and the requirements file, respectively.

```bash
panel convert <PATH_TO_PANEL_APP> --to pyodide-worker --index --requirements <PATH_TO_REQUIREMENTS_FILE> --out pyodide
```