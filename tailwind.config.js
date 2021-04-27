// tailwind.config.js
// 使っていないcssファイルの除去
module.exports = {
    purge: [
      // Use *.tsx if using TypeScript
      './pages/**/*.js',
      './components/**/*.js'
    ]
    // ...
  }