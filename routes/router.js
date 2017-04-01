/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();

router.route('/').get(function(req, res) {
    res.render('home/index');
});

// Export the module
module.exports = router;
