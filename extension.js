var vscode = require( 'vscode' );
var path = require( 'path' );
var childProcess = require( 'child_process' );

function activate( context )
{
    var outputChannel = vscode.workspace.getConfiguration( 'mermaid-export' ).get( 'debug', false ) ? vscode.window.createOutputChannel( "mermaid-export" ) : undefined;

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

    context.subscriptions.push( vscode.commands.registerCommand( 'mermaid-export.export', function()
    {
        var config = vscode.workspace.getConfiguration( 'mermaid-export' );
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document && editor.document.uri )
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

            debug( "cwd:" + cwd );
            debug( "command:" + command );

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
            } );
        }
    } ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
