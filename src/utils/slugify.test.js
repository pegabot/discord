/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { module: slugify } = require("./slugify");

const testData = [
  [" a  b ", "a-b"],
  ["hello", "hello"],
  ["Hello", "Hello"],
  ["Hello World", "Hello-World"],
  ["Hello-World", "Hello-World"],
  ["Hello:World", "Hello-World"],
  ["Hello,World", "Hello-World"],
  ["Hello;World", "Hello-World"],
  ["Hello&World", "Hello-World"],
  ["Hello & World", "Hello-World"],
  ["Hello.World.html", "Hello.World.html"],
  ["Hello World.html", "Hello-World.html"],
  ["Hello World!", "Hello-World"],
  ["Hello World!.html", "Hello-World.html"],
  ["Hello / World", "Hello/World"],
  ["Hello/World", "Hello/World"],
  ["H+e#l1l--o/W§o r.l:d)", "H-e-l1l-o/W-o-r.l-d"],
  [": World", "World"],
  ["Nguyễn Đăng Khoa", "Nguyen-Dang-Khoa"],
  ["Ä ä Ö ö Ü ü ß", "AE-ae-OE-oe-UE-ue-ss"],
  ["Á À á à É È é è Ó Ò ó ò Ñ ñ Ú Ù ú ù", "A-A-a-a-E-E-e-e-O-O-o-o-N-n-U-U-u-u"],
  ["Â â Ê ê Ô ô Û û", "A-a-E-e-O-o-U-u"],
  ["Â â Ê ê Ô ô Û 1", "A-a-E-e-O-o-U-1"],
  ["Привет мир", "Privet-mir"],
  ["Привіт світ", "Privit-svit"],
  ["Mórë thån wørds", "More-thaan-woerds"],
  ["Блоґ їжачка", "Blog-jizhachka"],
  ["фильм", "film"],
  ["драма", "drama"],
  ["ελληνικά", "ellinika"],
  ["C’est du français !", "C-est-du-francais"],
  ["Één jaar", "Een-jaar"],
  ["tiếng việt rất khó", "tieng-viet-rat-kho"],
];

describe("Checking cleanupPath Function", () => {
  for (const test of testData) {
    it(`Checking: "${test[0]}"`, () => {
      expect(slugify(test[0])).toBe(test[1]);
    });
  }
});
