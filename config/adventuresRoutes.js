const dbAdventures = require('../helpers/adventureModel');

// adventures end points
module.exports = server => {
  server.get('/adventures', getAllAdventures);
  server.get('/adventures/:id', getAdventureById);
  server.post('/adventures', addNewAdventure);
  server.delete('/adventures/:id', deleteAdventure);
  server.put('/adventures/:id', updateAdventure);
};


// Adventures routes

const getAllAdventures = (req, res) => {
  dbAdventures.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get Adventures.', error: err });
    });
}

const getAdventureById = (req, res) => {
  dbAdventures.get(req.params.id)
    .then(post => {
      console.log(post)
      if (post.length !== 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: `Failed to get Adventure with specific ID: ${req.params.id} does not exist` });
      }
    })
    .catch(err => {
      res.status(500).json({ message: `The Adventure with id: ${req.params.id} could not be retrieved.`, error: err });
    });
}

const deleteAdventure = async (req, res) => {
  const { id } = req.params;
  try {
    const recordsDeleted = await dbAdventures.remove(id);
    if (recordsDeleted > 0) {
      res.status(200).json(recordsDeleted);
    } else {
      res.status(404).json({ message: `Failed to delete Adventure, Adventure does not exist` });
    }
  } catch (err) {
    res.status(500).json({ message: "The Adventure could not be removed", err });
  }
}

const addNewAdventure = (req, res) => {
  dbAdventures.insert(req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to save Adventure", error: err });
    });
}

const updateAdventure = (req, res) => {
  if (req.params.id === undefined || req.body.adventure_type === undefined || req.body.location === undefined) {
    res.status(400).json({ errorMessage: "Adventure type and location are for the adventure are required." });
    return;
  }
  dbAdventures.update(req.params.id, req.body)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json({ message: `Internal server error. Could not update Action`, error: err });
    });

}

