import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import { readFileSync, writeFileSync } from 'fs';
import { Player } from './game_data/player';
import { Game } from './game_data/game';
import * as expressions from 'angular-expressions';
import { merge } from 'lodash';

export class DocX {

  generate(game: Game, player: Player) {
    // Get template
    const content = readFileSync('template/input.docx', 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip)
      .setOptions({ parser: angularParser });

    doc.setData({
      game,
      player,
    });

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object).
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      };
      console.log(JSON.stringify({ error: e }));
      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map((error) => error.properties.explanation)
          .join('\n');
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }

    const buf = doc.getZip()
      .generate({ type: 'nodebuffer' });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    writeFileSync(`output/${player.fullName}.docx`, buf);

  }

}

function angularParser(tag) {
  if (tag === '.') {
    return {
      get: (s) => s,
    };
  }
  const expr = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
  return {
    get: (scope, context) => {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = merge(obj, scopeList[i]);
      }
      return expr(scope, obj);
    },
  };
}
