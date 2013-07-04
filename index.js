var LevelUp = require('levelup'),
    Sublevel = require('level-sublevel'),
    LiveStream = require('level-live-stream');

var main = LevelUp('./mydb');

var db = Sublevel(main),
    sub = db.sublevel('stuff');

//put a key into the main levelup
db.put('name', 'Maiah', function (err) {
  if (err) throw err;
});

db.createReadStream()
  .on('data', function (data) {
    console.log('Root ', data.key, ' = ', data.value);
  });

//put a key into the sub-section!
sub.put('color', 'Green', function (err) {
  if (err) throw err;
});

sub.createReadStream()
  .on('data', function (data) {
    console.log('Sub ', data.key, ' = ', data.value);
  });

coolSub = db.sublevel('cool');

coolSub.put('Shape', 'Triangle', function (err) {
  if (err) throw err;
});

coolSub.put('Height', 'Tall', function (err) {
  if (err) throw err;
});

coolSub.createReadStream()
  .on('data', function (data) {
    console.log('CoolSub ', data.key, ' = ', data.value);
  });

coolSub = db.sublevel('cool/yes');

LiveStream(sub, { "tail": false })
  .on('data', function (data) {
    console.log('Stream ', data.key, ' = ', data.value);
  });

for (sublevelKey in main.sublevels) {
  var subl = main.sublevels[sublevelKey];
  console.log(subl);
  subl.createReadStream()
    .on('data', function (data) {
      console.log('Loop SUBs ', data.key, ' = ', data.value);
    });
}
