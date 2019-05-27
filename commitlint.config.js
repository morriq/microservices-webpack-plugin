module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'sentence-case'],
    'type-enum': [
      2,
      'always',
      [
        'Fix',
        'Update',
        'New',
        'Build',
        'Docs',
        'Breaking',
        'Upgrade'
      ]
    ]
  }
};
