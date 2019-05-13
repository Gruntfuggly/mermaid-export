var vscode = require( 'vscode' );
var path = require( 'path' );
var childProcess = require( 'child_process' );

function activate( context )
{
    var outputChannel;

    function resetOutputChannel()
    {
        if( outputChannel )
        {
            outputChannel.dispose();
            outputChannel = undefined;
        }
        if( vscode.workspace.getConfiguration( 'mermaid-export' ).debug === true )
        {
            outputChannel = vscode.window.createOutputChannel( "Mermaid Export" );
        }
    }

    function debug( text )
    {
        if( outputChannel )
        {
            outputChannel.appendLine( text );
        }
    }

    function replaceExtension( filename, extension )
    {
        var newFileName = path.basename( filename, path.extname( filename ) ) + extension;
        return path.join( path.dirname( filename ), newFileName );
    }

    debug( "Mermaid Export ready" );

    var status = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Left, 0 );

    context.subscriptions.push( outputChannel );
    context.subscriptions.push( status );

    context.subscriptions.push( vscode.commands.registerCommand( 'mermaid-export.showLog', function()
    {
        outputChannel.show();
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'mermaid-export.export', function()
    {
        var config = vscode.workspace.getConfiguration( 'mermaid-export' );
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document && editor.document.uri )
        {
            status.tooltip = "Saving " + editor.document.fileName + "...";
            status.text = "$(file-media) $(sync~spin)";
            status.color = undefined;
            status.show();

            editor.document.save().then( function()
            {
                var filename = editor.document.uri.fsPath;
                var outputFilename = replaceExtension( filename, '.' + config.get( 'outputType' ) );

                var workspaceFolder = vscode.workspace.getWorkspaceFolder( editor.document.uri );
                var cwd = workspaceFolder ? workspaceFolder.uri.fsPath : "/";

                var command = context.extensionPath + "/node_modules/.bin/mmdc -t " + config.get( 'theme' );

                var configFile = config.get( 'config' );
                if( configFile )
                {
                    if( path.isAbsolute( configFile ) === false )
                    {
                        configFile = path.join( workspaceFolder.uri.fsPath, configFile );
                    }
                    command += " -c \"" + configFile + "\"";
                }

                var cssFile = config.get( 'css' );
                if( cssFile )
                {
                    if( path.isAbsolute( cssFile ) === false )
                    {
                        cssFile = path.join( workspaceFolder.uri.fsPath, cssFile );
                    }
                    command += " -C \"" + cssFile + "\"";
                }

                command += " -i \"" + filename + '\"';
                command += " -o \"" + outputFilename + '\"';
                if( config.get( 'outputWidth' ) > 0 )
                {
                    command += " -w " + config.get( 'outputWidth' );
                }
                if( config.get( 'outputHeight' ) > 0 )
                {
                    command += " -H " + config.get( 'outputHeight' );
                }

                debug( "cwd:" + cwd );
                debug( "command:" + command );

                status.tooltip = "Exporting " + outputFilename + "...";
                status.text = "$(file-media) $(sync~spin)";

                var process = childProcess.exec( command, { cwd: cwd } );
                var results = "";

                process.stdout.on( 'data', function( data )
                {
                    results += data;
                } );

                process.stderr.on( 'data', function( error )
                {
                    debug( error );
                    console.error( error );
                    status.tooltip = "Export failed - click to show log";
                    status.command = "mermaid-export.showLog";
                    status.text = "$(file-media)";
                    status.color = "red";
                } );

                process.on( 'close', function( code )
                {
                    if( results )
                    {
                        debug( results );
                        console.log( results );
                    }
                    else
                    {
                        debug( "OK" );
                    }
                    status.hide();
                } );
            } );
        }
    } ) );

    context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
    {
        if( e.affectsConfiguration( "mermaid-export.debug" ) )
        {
            resetOutputChannel();
        }
    } ) );

    resetOutputChannel();
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
