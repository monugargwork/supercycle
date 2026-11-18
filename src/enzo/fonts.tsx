import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

let READY = false; // once loaded, the font stays loaded for the life of the render tab

/** Loads Bolota Bold and holds the frame until it's loaded AND the composition has re-rendered with it.
 *
 *  Title boxes are sized by measuring their text. The old hook released the frame as soon as the font arrived,
 *  but the layout had already been measured with the fallback font. The first frame in every fresh render tab
 *  (the start of every render chunk) came out with wrong title sizes, so the whole stage jumped for a frame or two
 *  (found 26 Oct 2026: 130 px vs 143 px title box). Use this in every composition. */
export const useBolota = () => {
  const [handle] = React.useState(() => (READY ? null : delayRender('Bolota font')));
  const [ready, setReady] = React.useState(READY);
  React.useEffect(() => {
    if (ready) return;
    let alive = true;
    const done = () => { READY = true; if (alive) setReady(true); };
    const to = setTimeout(done, 9000);
    (async () => {
      const buf = await (await fetch(staticFile('fonts/bolota-bold.ttf'))).arrayBuffer();
      const f = new FontFace('Bolota', buf, {weight: '100 900'});
      (document as any).fonts.add(f);
      await f.loaded;
    })().catch((e) => console.error('FONT FAIL', String(e))).finally(done);
    return () => { alive = false; clearTimeout(to); };
  }, [ready]);
  // runs after the re-render that `ready` triggers, so every text measurement already used the real font
  React.useEffect(() => { if (ready && handle !== null) continueRender(handle); }, [ready, handle]);
};
