const express = require('express');
const uuid = require('uuid');
const json2csv = require ('json2csv');
const fs = require('fs');
const router = express.Router();
const schedule = require('../../Schedule');

// Gets all matches
router.get('/', (req, res) => { 
    //res.json(runs)); 
    //res.format({
    //    'text/plain': function () {
    //        res.send(json2csv.parse(schedule))
    //    }
    //  })
    //});
    try {
        const jsonString = fs.readFileSync ('./Schedule.json', 'utf-8');
        schedule2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    } 
    res.format({
        'text/plain': function () {
            res.send(json2csv.parse(schedule2))
            }
        })
    });

// Get single match
router.get('/:match', (req, res) => {
    const found = schedule.some(event => event.match === parseInt(req.params.match));

    if (found) {
    res.json(schedule.filter(event => event.match === parseInt(req.params.match)));
    } else {
        res.status(400).json({ msg: `No match found with the id of ${req.params.match}` });
    }
});

// Create Match
router.post('/', (req, res) => {
    const newMatch = {
        match: req.body.match,
        blue_1: req.body.blue_1,
        blue_2: req.body.blue_2,
        red_1: req.body.red_1,
        red_2: req.body.red_2,
        field: req.body.field,
        tourney_key: req.body.tourney_key
    }

    if(!newMatch.match) {
        return res.status(400).json({ msg: 'Please fill out the entire form before submitting.' });
    }
    try {
        const jsonString = fs.readFileSync ('./Schedule.json', 'utf-8');
        schedule2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    }
    schedule2.push(newMatch)

    fs.writeFile('./Schedule.json', JSON.stringify(schedule2, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('File successfully written');
        }
    })
    res.redirect('/api/schedule');
});

// Update Match
router.put('/:id', (req, res) => {
    const found = schedule.some(run => run.id === parseInt(req.params.id));

    if (found) {
        const updMatch = req.body;
        runs.forEach(run => {
            if(run.id === parseInt(req.params.id)) {
            run.team_name = updRun.team_name ? updRun.team_name : run.team_name;
            run.team_number = updRun.team_number ? updRun.team_number : run.team_number;

            res.json({ msg: 'Run updated', run });
            }
        });
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

// Delete Match
router.delete('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
    res.json({ msg: 'Run deleted', runs: runs.filter(run => run.id !== parseInt(req.params.id))});
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

module.exports = router;