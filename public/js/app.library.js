function getFormJSON($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return JSON.stringify(indexed_array);
}

function parseDate(d) {
    d2 = d.getMonth() +'-'+ d.getDate() +'-'+d.getFullYear();
    return d2;
}