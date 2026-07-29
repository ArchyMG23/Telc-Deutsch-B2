const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf-8');

rules = rules.replace(
  "&& data.situation is string && data.situation.size() <= 2000",
  "&& data.situation is string && data.situation.size() <= 10000"
);

rules = rules.replace(
  "&& data.content is string && data.content.size() <= 5000",
  "&& data.content is string && data.content.size() <= 10000"
);

rules = rules.replace(
  "&& data.createdAt == request.time;",
  "&& (data.createdAt == request.time || data.createdAt is string);"
);

fs.writeFileSync('firestore.rules', rules);
