($(document).ready(() => {
  // For tooltips
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
  });

  // For custome files
  $(".custom-file-input").on("change", function() {
    const fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  })
}));