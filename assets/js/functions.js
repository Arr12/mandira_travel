function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? rupiah : "";
}
function starHotel(star) {
  let array = [
    [1, 2, 3, 4, 5],
    ["OneStar", "TwoStar", "ThreeStar", "FourStar", "All"],
  ];
  let result = 0;
  for (var i = 0; i < array[0].length; i++) {
    if (array[1][i] === star) {
      result += array[0][i];
    }
  }
  return result;
}
function Hotel(img, name, star, address, currency, prevPrice, totalPrice) {
  let result =
    `
  <div class="card p-2 my-3 card-object-search">
    <div class="row w-100 m-0">
      <div class="col-sm-12 col-md-4 col-lg-4 p-2">
        <div style="height: 305px;width: 100%;display: flex;">
        <img
          src="` +
    img +
    `"
          class="img-fluid rounded w-100"
          alt="` +
    name +
    `"
        />
        </div>
      </div>
      <div class="col-sm-12 col-md-8 col-lg-8 pl-4 pt-4">
        <div class="d-flex flex-column">
          <a href="#" class="text-dark link-non-underline">
            <h2>` +
    name +
    `</h2>
          </a>
          <div class="d-flex flex-row align-items-center my-2">
            <div class="d-flex flex-row mr-2">`;
  var starcount = starHotel(star);
  for (var i = 0; i < starcount; i++) {
    result += `<i class="fas fa-star text-warning f-18"></i>`;
  }
  result +=
    `
            </div>
            <span class="dot">.</span>
            <a href="#" class="address m-0 ml-2">` +
    address +
    `</a>
          </div>
          <div class="d-flex my-2">
            <span class="badge bg-primary text-white px-2">4.5</span>
            <p class="text-primary m-0 font-weight-bold ml-2">Good</p>
          </div>
        </div>
        <div class="row w-100 m-0 mt-3">
          <div class="col-sm-12 col-md-12 col-lg-8 p-0">
            <div class="d-flex flex-row">
              <div class="d-flex align-items-center text-truncate mr-3 properties">
                <i class="fas fa-heart pr-3 f-24"></i>
                <span class="text-truncate">InDonesia Care</span>
              </div>
              <div class="d-flex align-items-center text-truncate mr-3 properties">
                <i class="fas fa-calendar-times pr-3 f-24"></i>
                <span class="text-truncate">Pembatalan Gratis</span>
              </div>
              <div class="d-flex align-items-center text-truncate mr-3 properties">
                <i class="fas fa-utensils pr-3 f-24"></i>
                <span class="text-truncate">Sarapan Gratis</span>
              </div>
              <span class="badge text-white bg-gray properties-num">+2</span>
            </div>
            <div class="d-flex mt-4">
              <i class="fas fa-heart pr-3 f-24"></i>
              <i class="fas fa-check-circle pr-3 f-24"></i>
              <i class="fas fa-wine-glass-alt"></i>
              <i class="fas fa-swimmer pr-3 f-24"></i>
              <i class="fas fa-wifi pr-3 f-24"></i>
              <span class="badge text-white bg-gray properties-num">+6</span>
            </div>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-4 p-0">
            <div class="d-flex flex-column align-items-end mt-4">
              <div class="d-flex align-items-center bg-danger px-2 py-1 rounded position-relative hbd">
                <i class="fas fa-gift text-white"></i>
                <span class="ml-2 text-white font-weight-bold">
                  Holiday Best Deals
                </span>
              </div>
              <del class="mt-3 text-gray">` +
    currency +
    ` ` +
    prevPrice +
    `</del>
              <p class="text-danger m-0">
              ` +
    currency +
    ` <span class="font-weight-bold f-24">` +
    totalPrice +
    `</span>
              </p>
              <span class="text-gray">per kamar per malam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  return result;
}

$(document).ready(function () {
  // select 2 javascript
  $("#selectStar").select2();
  $("#priceHotel").select2();
  $(".js-example-basic-single").select2();

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
          done(data);
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

  // SHOW DATA ALL
  // $.ajax({
  //   url: "data/Response.xml",
  //   type: "GET",
  //   dataType: "xml",
  //   success: function (result) {
  //     var json = xmlToJson.parse(result);
  //     var data = json["s:Envelope"]["s:Body"].HotelSearchResponse.HotelResultList.HotelResult;
  // let objectResult = '';
  // data.map((i, v) => {
  //   var img = i.HotelInfo.HotelPicture;
  //   var name = i.HotelInfo.HotelName;
  //   var star = i.HotelInfo.Rating;
  //   var address = i.HotelInfo.HotelAddress;
  //   var currency = i.MinHotelPrice.Currency;
  //   var prevPrice = i.MinHotelPrice.PrefPrice;
  //   var totalPrice = i.MinHotelPrice.TotalPrice;
  //   objectResult += Hotel(img, name, star, address, currency, prevPrice, totalPrice);
  // });

  //     $("#result_search").html(objectResult);
  //   },
  // });
});
