document.querySelectorAll('.subcategory-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Retire la classe 'active' de tous les boutons
        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ajoute la classe 'active' au bouton cliqué
        this.classList.add('active');
        
        // Ici, vous pouvez ajouter du code pour changer le contenu affiché
        // en fonction de la catégorie sélectionnée
    });
});