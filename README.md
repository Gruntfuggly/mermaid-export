# Mermaid Export

Adds a command *Mermaid Export: Export* which calls `mermaid.cli` to convert a Mermaid diagram source file to an image file. The command is available from the standard command prompt (Press **F1** or **ctrl+shift+P**, and type *mermaid*).

The image file will be generated alongside the source file, replacing the extension with the extension for the selected output type, with `.png` being the default.

The source file should just contain mermaid code and should be saved before exporting.

If it doesn't work as expected, the command *Mermaid Export: Show Log*, will show the command generated and other information in a output window.

Todo:

- export diagrams from inside Markdown source

## Configuration

| Setting                       | Default | Function                                                                           |
|:------------------------------|:--------|:-----------------------------------------------------------------------------------|
| `mermaid-export.outputType`   | png     | Output file type (svg, png or pdf )                                                |
| `mermaid-export.outputWidth`  | 0       | Override the width of the output diagram (set to 0 for automatic sizing)           |
| `mermaid-export.outputHeight` | 0       | Override the height of the output diagram (set to 0 for automatic sizing)          |
| `mermaid-export.theme`        | default | Theme for output file (default, dark, forest or neutral)                           |
| `mermaid-export.config`       |         | Extra configuration options file (see https://mermaidjs.github.io/#/mermaidAPI) |
| `mermaid-export.css`          |         | CSS styling file                                                                   |

The paths for the config and css files can be absolute, or relative to the workspace folder.

The configuration file is JSON format, e.g.:

```json
{
    "sequence": {
        "diagramMarginX": 10,
        "diagramMarginY": 20
    }
}
```

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.mermaid-export).

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/mermaid-export).

## Credits

Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>

Uses the [mermaid.cli](https://github.com/mermaidjs/mermaid.cli) command line interface package.
