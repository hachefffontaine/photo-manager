const { exec } = require('child_process');

const searchByMetadata = (query) => {
  return new Promise((resolve, reject) => {
    const cmd = `exiftool -q -r -if '$XMP:TagsList =~ /${query}/' -p '$Directory/$FileName' "C:/Users/hufontaine/OneDrive - Sopra Steria/Pictures" > result.hfo`;

    console.log( cmd );

    exec(cmd, (error, stdout, stderr) => {
      console.log( error );
      console.log( stdout );
      console.log( stderr );
      if (error) {
        reject({ error: error.message, stderr });
        return;
      }
      const files = stdout.trim().split('\n').filter(f => f);
      resolve({ results: files });
    });
  });
};

module.exports = { searchByMetadata };
