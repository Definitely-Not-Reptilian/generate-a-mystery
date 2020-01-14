import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { Player } from './game_data/player';
import { Game } from './game_data/game';
import * as expressions from 'angular-expressions';
import { merge } from 'lodash';

export class DocX {

  generateItems(game: Game) {
    this.generate('items', { game }, 'Items');
  }

  generatePlayer(game: Game, player: Player) {
    this.generate('input', { game, player }, player.title);
  }

  generate(input: string, data: any, output: string) {
    // Get template
    const content = readFileSync(`template/${input}.docx`, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip)
      .setOptions({ parser: angularParser });

    doc.setData(data);

    this.safeRender(doc);

    const buf = doc.getZip()
      .generate({ type: 'nodebuffer' });

    try {
      mkdirSync('output');
    } catch (e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    writeFileSync(`output/${output}.docx`, buf);

  }

  safeRender(doc) {
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
  }

}
function replacer(input: string, game: Game) {
  const tagRegex = /{(.*)}/g;
  return input.replace(tagRegex, (_match, tagContents: string) => {
    for (const player of game.players) {
      if (tagContents.toLowerCase().replace(/[^\w]/gi, '').includes(player.title.toLowerCase().replace(/[^\w]/gi, ''))) {
        const tagSplit = tagContents.toLowerCase().split(' ')
        if (tagSplit.includes('fullname')) {
          return player.fullName;
        } else if (tagSplit.includes('l') || tagSplit.includes('lastname')) {
          return player.lastName;
        } else {
          return player.firstName;
        }
      }
    }
    console.warn('There was an error trying to substitute a name with the directive', tagContents)
    return 'ERROR SUSTITUTING SOMETHING HERE';
  });
}
function contextToObject(context) {
  return merge({}, ...context.scopeList);
}
function angularParser(tag) {
  if (tag === '.') {
    return {
      get: (scope, context) => replacer(scope, contextToObject(context).game),
    };
  }
  const expr = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
  return {
    get: (scope, context) => {
      const obj = contextToObject(context);
      const result = expr(scope, obj);
      if (typeof result !== 'string') {
        return result;
      }
      return replacer(result, obj.game);
    },
  };
}
