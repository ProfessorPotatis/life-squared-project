/**
 * Client script for inspiration.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 // Connect to socket.io.
 let socket = io();

 let addButton = document.getElementsByClassName('textImg');
 var selectList = document.getElementById('selectList');
 let selectedList;
 let typeOfList;
 let saved = document.getElementsByClassName('saved')[0];

 // Add support for touch event on mobile
 let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

 selectList.addEventListener('change', function(event) {
     selectedList = event.target.options[event.target.selectedIndex].id;
     typeOfList = event.target.options[event.target.selectedIndex].getAttribute('data-list');
 });

 for (let i = 0; i < addButton.length; i += 1) {
     addButton[i].addEventListener(touchEvent, function(event) {
         addToList(event.target);
     });
 }

 // When user clicks on 'Add to list' -> add clicked element to selected list
 function addToList(target) {
     let goal = target.getAttribute('value');
     socket.emit('addGoal', {list: typeOfList, id: selectedList, goal: goal});
 }

 socket.on('success', function() {
     saved.removeAttribute('hidden');
     saved.textContent = '';
     saved.textContent = 'The goal was saved successfully.';
 });

 socket.on('unsuccessful', function() {
     saved.removeAttribute('hidden');
     saved.textContent = '';
     saved.textContent = 'Could not save the goal to the selected list.';
 });
