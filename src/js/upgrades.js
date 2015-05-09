
module.exports = {
  Scoreboard: {
    category: 'Visual',
    levels: [{cost: 5, description: 'Visualize your score!'}]
  },
  'Basic Layout': {
    category: 'Visual',
    levels: [
      {cost: 15, description: 'A slightly better layout.'},
      {cost: 200, description: 'Another slightly better layout.'}
    ]
  },
  'Better Layout': {
    category: 'Visual',
    requirements: {'Basic Layout': 1},
    levels: [
      {cost: 200, description: 'One of the better layouts you get to see.'},
      {cost: 2000, description: 'Probably the best layout in the game.'}
    ]
  },
  Function: {
    category: 'Tech',
    levels: [{cost: 20, description: 'Access to a function is necessary to gain more power.'}]
  },
  'Basic Iteration': {
    category: 'Tech',
    requirements: {Function: 0},
    levels: [
      {cost: 50, description: 'More iterations means faster production.'},
      {cost: 300, description: 'Even more iterations means even faster production.'},
      {cost: 20000, description: 'Yet more iterations means yet faster production.'},
      {cost: 150000, description: 'Many iterations means much faster production.'}
    ]
  },
  'Basic Timer': {
    category: 'Tech',
    requirements: {Function: 0},
    levels: [
      {cost: 50, description: 'A timer runs and automatically produces for you every so often.'},
      {cost: 600, description: 'The timing of the timer is slightly faster.'},
      {cost: 20000, description: 'The timer runs even faster now.'},
      {cost: 100000, description: 'The timer goes zoom zoom!'}
    ]
  },
  'Basic Boost': {
    category: 'Tech',
    requirements: {Function: 0},
    levels: [
      {cost: 10, description: 'Bigger boost means more production happening at once.'},
      {cost: 1000, description: 'Even bigger boost means even more production.'},
      {cost: 25000, description: 'Yet a bigger boost means a higher production yield.'},
      {cost: 200000, description: 'The biggest boost means the best production.'}
    ]
  },
  Capitalization: {
    category: 'Visual',
    requirements: {'Scoreboard': 0},
    levels: [{cost: 100, description: 'Sometimes good punctuation just looks nice.'}]
  },
  Preformatting: {
    category: 'Visual',
    requirements: {'Basic Iteration': 0},
    levels: [{cost: 1500, description: 'Better code formatting for readability'}]
  },
  'Visual Countdown': {
    category: 'Visual',
    requirements: {'Basic Timer': 0},
    levels: [{cost: 1000, description: 'It might help to see the countdown for the timer run.'}]
  },
  'Page Title': {
    category: 'Cosmetic',
    requirements: {'Basic Layout': 0},
    levels: [{cost: 500, description: 'A nicer looking page title. So revealing!'}]
  },
  'Better Page Title': {
    category: 'Cosmetic',
    requirements: {'Page Title': 0, 'Scoreboard': 0},
    levels: [{cost: 2500, description: 'Just when you thought the page title looked good, it gets better!'}]
  },
  'Alphabetized Upgrades': {
    category: 'Cosmetic',
    requirements: {'Capitalization': 0, 'Better Layout': 0},
    levels: [{cost: 5000, description: 'Putting the upgrades in some kind of order makes them much easier to navigate.'}]
  },
  'Upgrade Visibility': {
    category: 'Cosmetic',
    requirements: {'Alphabetized Upgrades': 0},
    levels: [
      {cost: 6500, description: 'Upgrades will appear slightly before you can buy them.'},
      {cost: 8500, description: 'Upgrades will appear a while before you can buy them.'},
      {cost: 10500, description: 'Upgrades will show up quite a ways before you can buy them.'}
    ]
  },
  'Progress Bar': {
    category: 'Visual',
    requirements: {'Better Layout': 1, 'Basic Color': 0, 'Visual Countdown': 0},
    levels: [{cost: 5000, description: 'Transform your countdown into a progress bar instead!'}]
  },
  'Basic Style': {
    category: 'Visual',
    requirements: {'Better Layout': 1},
    levels: [
      {cost: 10000, description: 'Yes, it does get better! This upgrade makes the table look nicer.'},
      {cost: 20000, description: 'This upgrade fixes some slight alignment issues introduced by the previous upgrade.'}
    ]
  },
  'Basic Color': {
    category: 'Visual',
    requirements: {'Basic Style': 0},
    levels: [{cost: 12500, description: 'Add some color to the page.'}]
  },
  Iconography: {
    category: 'Visual',
    requirements: {'Basic Style': 0},
    levels: [{cost: 25000, description: 'Get some icons on the page.'}]
  },
  'Number Formatting': {
    category: 'Cosmetic',
    requirements: {'Basic Style': 0},
    levels: [{cost: 20000, description: 'Format the numbers more nicely!'}]
  },
  'Basic Animation': {
    category: 'Cosmetic',
    requirements: {'Basic Style': 0, 'Basic Iteration': 0, 'Basic Color': 0, 'Better Layout': 1},
    levels: [{cost: 100000, description: 'Sprinkle some animations onto the page.'}]
  },
  'Favicon': {
    category: 'Cosmetic',
    requirements: {'Better Layout': 1},
    levels: [{cost: 2000, description: 'Add the favicon to the header bar.'}]
  },
  'Best Favicon': {
    category: 'Cosmetic',
    requirements: {'Better Page Title': 0, 'Favicon': 0},
    levels: [{cost: 100000, description: 'Get notified via favicon whenever you have a new upgrade to purchase.'}]
  },
  'Syntax Highlighting': {
    category: 'Cosmetic',
    requirements: {'Preformatting': 0},
    levels: [{cost: 50000, description: 'Make every code portion look even better!'}]
  },
  'Save': {
    category: 'Tech',
    requirements: {'Basic Layout': 0},
    levels: [
      {cost: 300, description: 'Introduce a save button that allows you to save your progress.'},
      {cost: 5000, description: 'Introduce a mechanic that saves occasionally.'},
      {cost: 20000, description: 'Introduce a debug menu where you can see your save data.'},
      {cost: 150000, description: 'Make the game save automatically after production or purchases.'}
    ]
  },
  'Advanced Timer': {
    category: 'Tech',
    requirements: {'Basic Timer': 3},
    levels: [
      {cost: 200000, description: 'The timer is back and faster than ever.'},
      {cost: 750000, description: 'Just when you thought the timer was out of tricks, it gets faster!'},
      {cost: 1500000, description: 'The fastest timer yet!'},
      {cost: 1000000000, description: 'This costs 1,000,000,000 snot bubbles, or what have you.'}
    ]
  },
  'Best Table': {
    category: 'Tech',
    requirements: {'Basic Style': 1, 'Alphabetized Upgrades': 0},
    levels: [{cost: 250000, description: 'This gives you the best upgrade table possible!'}]
  },
  Menu: {
    category: 'Tech',
    requirements: {'Basic Layout': 0},
    levels: [{cost: 2500, description: 'Buy a dropdown menu. Things end up here.'}]
  },
  'Help Menu': {
    category: 'Tech',
    requirements: {'Menu': 0},
    levels: [{cost: 2, description: 'The cheapest upgrade in the game. I bet you have no idea what it does.'}]
  },
  Tooltips: {
    category: 'Tech',
    requirements: {'Help Menu': 0},
    levels: [{cost: 17500, description: 'Well, this sure is self-referential.'}]
  },
  'Options Menu': {
    category: 'Tech',
    requirements: {'Menu': 0},
    levels: [{cost: 5000, description: 'All of the stange options go here. Also, you can reset your game.'}]
  },
  'Offline Progress': {
    category: 'Tech',
    requirements: {'Basic Timer': 0},
    levels: [
      {cost: 10000, description: 'You will gain progress slowly, even while the game is not open.'},
      {cost: 100000, description: 'You will gain progress slightly faster, even while the game is not open.'},
      {cost: 1000000, description: 'You will gain progress normally, even while the game is not open.'}
    ]
  },
  'Confirmation Dialogs': {
    category: 'Tech',
    requirements: {'Help Menu': 0},
    levels: [{cost: 100000, description: 'You get notified of potentially dangerous actions. Beware!'}]
  },
  'Currency Name Change': {
    category: 'Cosmetic',
    requirements: {'Options Menu': 0},
    levels: [{cost: 650000, description: 'If you dislike the name units, you can change it!'}]
  },
  'Basic Timer Boost': {
    category: 'Tech',
    requirements: {'Basic Timer': 0},
    levels: [
      {cost: 10000, description: 'You get more production via timer methods.'},
      {cost: 500000, description: 'You get even more production via the timer.'},
      {cost: 2500000, description: 'The timer is now quite lucrative.'}
    ]
  },
  Notifications: {
    category: 'Tech',
    requirements: {'Basic Animation': 0, Iconography: 0, 'Basic Color': 0, 'Basic Style': 0},
    levels: [{cost: 50000, description: 'Get notified about various happenings!'}]
  },
  Advertisements: {
    category: 'Tech',
    requirements: {Notifications: 0},
    levels: [{cost: 20000, description: 'Advertisements for other, related games!'}]
  },
  Adblocker: {
    category: 'Tech',
    requirements: {Advertisements: 0},
    levels: [{cost: 200000, description: 'Ads got you down? Turn them off with this fancy upgrade!'}]
  },
  'Tabbed Output': {
    category: 'Tech',
    requirements: {'Better Layout': 0, 'Basic Style': 0},
    levels: [{cost: 200000, description: 'Produce some tabs for your output section! Note, this only comes with one tab -- the one you have!'}]
  },
  'Production Over Time': {
    category: 'Tech',
    requirements: {'Tabbed Output': 0, 'Number Formatting': 0},
    levels: [{cost: 2000000, description: 'Produce a new tab that shows your production over time!'}]
  },
  'Production Breakdown': {
    category: 'Tech',
    requirements: {'Tabbed Output': 0, 'Number Formatting': 0},
    levels: [{cost: 2000000, description: 'Produce a new tab that shows your production breakdown!'}]
  },
  'Production History': {
    category: 'Tech',
    requirements: {'Production Breakdown': 0},
    levels: [
      {cost: 50000, description: 'Slightly improve your historical data!'},
      {cost: 125000, description: 'Slightly improve your historical data!'}
    ]
  },
  'Production Labels': {
    category: 'Tech',
    requirements: {'Production Over Time': 0},
    levels: [{cost: 50000, description: 'Get some labels on that chart!'}]
  },
  'Breakdown Labels': {
    category: 'Tech',
    requirements: {'Production Breakdown': 0},
    levels: [{cost: 50000, description: 'Get some labels on that chart!'}]
  },
  'Achievements': {
    category: 'Tech',
    requirements: {'Scoreboard': 0, 'Notifications': 0},
    levels: [{cost: 75000, description: 'If you have goals in life, this is recommended.'}]
  },
  'Achievements Menu': {
    category: 'Tech',
    requirements: {'Achievements': 0, 'Menu': 0},
    levels: [{cost: 777777, description: 'If you want to view your goals in life, this is recommended.'}]
  },
  'Upgrade Tree': {
    category: 'Tech',
    requirements: {'Tabbed Output': 0, 'Basic Color': 0, 'Tooltips': 0, 'Basic Animation': 0},
    levels: [{cost: 100000, description: 'Visualize the upgrade tree! Oooh, pretty!'}]
  },
  'Upgrades Menu': {
    category: 'Tech',
    requirements: {'Menu': 0},
    levels: [{cost: 150000, description: 'See what this game has cost you!'}]
  }
};
