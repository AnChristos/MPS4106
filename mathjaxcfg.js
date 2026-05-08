window.MathJax = {
  section: 1,
  tex: {
    tags: 'ams',
    packages: {'[+]': ['tagformat', 'sections']},
    tagformat: {
      number: (n) => {
        const s = window.MathJax.config.section;
        
        // Logic: If section is 13 or higher, start A, B, C
        if (s > 12) {
          // 13 becomes 1 (A), 14 becomes 2 (B), etc.
          const appendixNum = s - 12; 
          const letter = String.fromCharCode(64 + appendixNum);
          return letter + '.' + n;
        }
        
        // Otherwise, standard 1.1, 2.1... 12.1
        return s + '.' + n;
      },
      id: (tag) => 'eqn-id:' + tag
    },
    preFilters: [
      ({math}) => {
        if (math.inputData.recompile) {
          window.MathJax.config.section = math.inputData.recompile.section;
        }
      }
    ],
    postFilters: [
      ({math}) => {
        if (!math.inputData.recompile) math.inputData.recompile = {};
        math.inputData.recompile.section = window.MathJax.config.section;
      }
    ]
  },
  loader: {load: ['[tex]/tagformat']},
  startup: {
    ready() {
      const Configuration = MathJax._.input.tex.Configuration.Configuration;
      const CommandMap = MathJax._.input.tex.TokenMap.CommandMap;
      
      new CommandMap('sections', {
        nextSection(parser, name) {
          window.MathJax.config.section++;
          parser.tags.counter = parser.tags.allCounter = 0;
        }
      });

      Configuration.create('sections', {handler: {macro: ['sections']}});
      MathJax.startup.defaultReady();
    }
  }
};