document.getElementById("categoryFilter").addEventListener("change", filterTable);

function filterTable() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("categoryFilter");
  filter = input.value.toUpperCase();
  table = document.getElementById("Usertable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[6]; // Assuming the role is in the second column (index 1)
    if (td) {
      if (filter === "" || td.innerHTML.toUpperCase() === filter) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
