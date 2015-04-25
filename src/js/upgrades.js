
module.exports = {
  Scoreboard: {
    category: 'Visual',
    costs: [10]
  },
  'Basic Layout': {
    category: 'Visual',
    costs: [15, 200]
  },
  'Better Layout': {
    category: 'Visual',
    requirements: {'Basic Layout': 1},
    costs: [200, 2000]
  },
  Function: {
    category: 'Tech',
    costs: [20]
  },
  'Basic Iteration': {
    category: 'Tech',
    requirements: {Function: 0},
    costs: [50, 300, 2000, 15000]
  },
  'Basic Timer': {
    category: 'Tech',
    requirements: {Function: 0},
    costs: [50, 600, 20000, 100000]
  },
  'Basic Boost': {
    category: 'Tech',
    requirements: {Function: 0},
    costs: [10, 100, 2500, 10000]
  },
  Grammar: {
    category: 'Visual',
    costs: [100]
  },
  Preformatting: {
    category: 'Visual',
    requirements: {'Basic Iteration': 0},
    costs: [150]
  },
  'Visual Countdown': {
    category: 'Visual',
    requirements: {'Basic Timer': 0},
    costs: [1000]
  },
  'Page Title': {
    category: 'Cosmetic',
    costs: [500]
  },
  'Better Page Title': {
    category: 'Cosmetic',
    requirements: {'Page Title': 0, 'Scoreboard': 0},
    costs: [2500]
  },
  'Alphabetized Upgrades': {
    category: 'Cosmetic',
    requirements: {'Grammar': 0, 'Better Layout': 0},
    costs: [5000]
  },
  'Upgrade Visibility': {
    category: 'Cosmetic',
    requirements: {'Alphabetized Upgrades': 0},
    costs: [6500, 8500, 10500]
  },
  'Progress Bar': {
    category: 'Cosmetic',
    requirements: {'Better Layout': 1},
    costs: [5000]
  }
};