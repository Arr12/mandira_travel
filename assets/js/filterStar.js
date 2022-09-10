$(document).ready(function () {
  $("#selectStar").on("change", function () {
    var starInput = $(this).val();
    var priceInput = $("#priceHotel").val();
    priceInputChange = priceInput.split("-");
    var priceFirst = priceInputChange[0];
    var priceEnd = priceInputChange[1];

    //pagination
    var dataContainer = $("#tab");
    dataContainer.pagination({
      dataSource: function (done) {
        $.ajax({
          url: "data/Response.xml",
          type: "GET",
          dataType: "xml",
          success: function (result) {
            var json = xmlToJson.parse(result);
            var data =
              json["s:Envelope"]["s:Body"].HotelSearchResponse.HotelResultList
                .HotelResult;
            var xdata = [];
            data.map((i, v) => {
              if (starInput === "" && priceInput === "") {
                xdata.push(i);
              }
              else if (priceInput != "") {
                if (
                  starHotel(i.HotelInfo.Rating) === parseInt(starInput) &&
                  Math.ceil(i.MinHotelPrice.TotalPrice) >=
                    parseInt(priceFirst) &&
                  Math.ceil(i.MinHotelPrice.TotalPrice) <= parseInt(priceEnd)
                ) {
                  xdata.push(i);
                }
              } else {
                if (starHotel(i.HotelInfo.Rating) === parseInt(starInput)) {
                  xdata.push(i);
                }
              }
            });
            done(xdata);
          },
        });
      },
      // locator: 'HotelSearchResponse',
      totalNumberLocator: function (response) {
        // you can return totalNumber by analyzing response content
        return Math.floor(Math.random() * (1000 - 100)) + 100;
      },
      pageSize: 20,
      ajax: {
        beforeSend: function () {
          dataContainer.prev().html("Loading data ...");
        },
      },
      callback: function (data, pagination) {
        // window.console && console.log(22, data, pagination);
        $("#dataShow").html(formatRupiah(pagination.totalNumber.toString()));
        let objectResult = "";
        data.map((i, v) => {
          objectResult += Hotel(
            i.HotelInfo.HotelPicture,
            i.HotelInfo.HotelName,
            i.HotelInfo.Rating,
            i.HotelInfo.HotelAddress,
            i.MinHotelPrice.Currency,
            formatRupiah(Math.ceil(i.MinHotelPrice.PrefPrice).toString()),
            formatRupiah(Math.ceil(i.MinHotelPrice.TotalPrice).toString())
          );
        });
        dataContainer.prev().html(objectResult);
      },
    });
  });
});
