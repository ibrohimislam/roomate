function getFormJSON($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return JSON.stringify(indexed_array);
}

function parseDate(d) {
    d2 = (d.getMonth()+1) +'-'+ d.getDate() +'-'+d.getFullYear();
    return d2;
}

function parseDateSQL(d) {
	console.log(d);
    d2 = d.getFullYear() +'/'+ pad(d.getMonth()+1,2) +'/'+ pad(d.getDate(),2);
    return d2;
}

function dateTranslation(d, i){
	var now = new Date(d);
	now.setDate(now.getDate()+i*7);
	return now;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}