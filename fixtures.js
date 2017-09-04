(function($, FootballFixtures, undefined){
  $(document).ready(function () {
    //$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://www.ving.no/Handlers/ContentHandler.ashx?h=fbeb34355a97862ff19d19484c0ac9998d2a38ad&s=3&f=2&c=common') );

    String.prototype.repeat = function(times) {
       return (new Array(times + 1)).join(this);
    };

    function getTeam(){
      var levels = window.location.pathname.split('/');
      var teamURL = levels[levels.length-1];
      return teamURL;
    }

      var s,
      FootballFixtures = {
          settings : {
            locale: window.location.hostname.split('.')[2],
            team: appConfig.teams[getTeam()]
          },



          init: function (container) {
              s = this.settings;
              if (container.length && s.team) {
                s.container = container
                s.spreadsheet = 'https://spreadsheets.google.com/feeds/list/' + appConfig.sheetID + '/' + appConfig.teams[getTeam()].pagenr + '/public/basic?hl=en_US&alt=json-in-script';
              }else{
                FootballFixtures.ui.debug(' --> Container ' + container + ' does not exist');
                return;
              };
              FootballFixtures.loadFixtures(this.settings);

              if (s.team.salesInfo) {
                $(container).append('<div class="clearfix grid-row"><div class="message-box information expand" data-reactid="60"><div class="text left" data-reactid="61"><span class="icon left tcneicon-info" data-reactid="62"></span><span class="message-text left" data-reactid="63">'+s.team.salesInfo+'</span></div></div></div>');
              }
          },

          bindUIActions: function () {
              $('.grid-section').on('change', 'input:radio', function(){
                  var row = $(this).closest('tr');
                  if (row.next().attr('id') != $('tr#fixtureBooking').attr('id')) {
                    $('tr#fixtureBooking').insertAfter(row);
                  }

                  fixtureData=this.value.split(':');

                  end = '1001_6_16.jpg';
            			if (fixtureData[4] == "SOUT") {
            				end = '1001_5_16.jpg';
            			}else if (s.team.img == "MAN" && fixtureData[4] == "HUDD"){
            				end = '1001_8_17.jpg';
            			}else if (s.team.img == "MAN" && fixtureData[4] == "WESH"){
            				end = '1001_6_16.jpg';
            			}else if (s.team.img == "LPL" && fixtureData[4] == "WESH"){
            				end = '1001_7_20.jpg';
            			}else if (s.team.img == "MAN" && fixtureData[4] == "WEBR"){
            				end = '1001_4_16.jpg';
            			}else if (s.team.img == "MAN" && fixtureData[4] == "CHEL"){
            				end = '1001_4_16.jpg';
            			}
            			$('#matchImage img').attr('src','//images2.ving.no/images/Hotel/H' + s.team.img + fixtureData[4] + end);

                  if(fixtureData[5]!='-'){
                    $('#matchInfo').html(fixtureData[5]);
                  }else {
                    $('#matchInfo').html('');
                  }
                  (fixtureData[3].toLowerCase()=="ineligible") ? $('#matchBooking').hide() : $('#matchBooking').show();
              });

              $('.pax-select__child-selector select').on('change', function(){
                FootballFixtures.ui.paxSelectorsAges(this.value);
              });

              $('#fixtureBooking a').on('click', function(){
                var adults = '42,'.repeat(parseInt($('.pax-select__adult-selector select').val()));
                var children = getChildren($('.pax-select__child-selector select').val());
                var QueryRoomAges = adults + '' + children;

                function getChildren(children){
                  var childAges = '';
                  $('.pax-select__child-ages').find('select').each(function(){
                    if (this.value!=-1) {
                      childAges += this.value+',';
                    }
                  });
                  return childAges.slice(0,-1);
                }

                searchvars = $('input[type=radio]:checked').val().split(':');

                url = 'https://' + window.location.hostname + '' + appConfig.hotelPageURL + '?QueryDepID=-1&QueryCtryID='+s.team.ctryid+'&QueryAreaID=0&QueryResID='+s.team.resid+'&QueryDestID=0&QueryChkInDate='+searchvars[1]+'&QueryChkOutDate='+searchvars[2]+'&QueryDepDate=00010101&QueryRetDate=00010101&QueryDur=NaN&CategoryId=6&QueryRoomAges=|'+QueryRoomAges+'&QueryUnits=1';

                if (!$('#member').length || $('#member').is(':checked')) {
                  var data = JSON.stringify( {team: s.team.teamCode, fixture: $('input[type=radio]:checked').attr('id'), adults: adults, children: children });
                  sessionStorage.setItem('footballFixture', data);
                  window.location = url;
                }else{
                  alert(appConfig.bookingText.membershipError);
                }

                //console.log(burl);
              })
          },

          checkCapasity: function (status, from, to){
            if (status!="sold out") {
              return dateConvert(from, 'DD/MM') +'-' + dateConvert(to, 'DD/MM');
            }else{
              return appConfig.bookingText.soldout;
            }
          },

          loadFixtures: function (settings) {
              $.ajax({
                  type: 'GET',
                  url: settings.spreadsheet,
                  dataType: 'jsonp',
                  error: function (jqXHR, textStatus, errorThrown, statusCode) {
                      FootballFixtures.ui.debug(jqXHR);
                  },
                  success: this.formatFixtures
              });
          },

          formatFixtures: function(data) {
              var fixture = [];
              var fixtures = [];
              var tm = new Team(s.team, '');

              if(data.feed.entry){
                $.each(data.feed.entry, function(index, sheetRow) {
    				          fixture = sheetRow.content.$t.split(', ');
                      if (fixture.length < 12) {
                        FootballFixtures.ui.debug('Fixtures not loaded. Error in spreadsheet.');
                        return;
                      }else {
                        tm.addFixture(fixture, index);
                      }

                });
                FootballFixtures.ui.printFixtures(tm.getFixtures(s.team));
              }else{
                FootballFixtures.ui.debug('Fixtures not loaded. data.feed.entry is empty.');
              }
          },

          ui: {
              debug: function (info) {
                  console.log(info);
              },

              paxSelectors: function() {
                var paxContainer = '<div class="pax-select" style="float: left;"><div class="pax-select__room">';

                var paxContainerAdults = '<div class="pax-select__adult-selector simple-select"><label class="simple-select__label">'+appConfig.bookingText.adults+'</label><div class="simple-select__arrow"></div><select>';

                var paxContainerChildren = '<div class="pax-select__child-selector simple-select"><label class="simple-select__label">'+appConfig.bookingText.children+'</label><div class="simple-select__arrow"></div><select>';

                for (i=0; i<=6; i++){
                  var selected = '';
                  (i==2) ? selected=' selected' : selected= '';
                  paxContainerAdults += '<option value="'+i+'"'+selected+'> '+i+' </option>';

                  (i==0) ? selected=' selected' : selected ='';
                  paxContainerChildren += '<option value="'+i+'"'+selected+'> '+i+' </option>';
                }

                return paxContainer.concat(paxContainerAdults,'</select></div>',paxContainerChildren,'</select></div></div><div class="pax-select__child-ages"></div><div class="pax-information"></div></div>');
              },

              paxSelectorsAges: function (n,ages) {
                var current = $('.pax-select__child-ages').children().length;
                var childSelect = '<div class="pax-select__child-age-selector simple-select"><label class="simple-select__label">'+appConfig.bookingText.childAge+'</label><div class="simple-select__arrow"></div><select><option value="-1"> '+appConfig.bookingText.choose+' </option>';
                for (i=0; i<18; i ++){
                  childSelect += '<option value="'+i+'"> '+i+' '+ appConfig.bookingText.year+' </option>';
                }
                childSelect += '</select></div>';


                if (ages && ages[0]!='') {
                  $('.pax-select__child-selector select').val(ages.length)
                };
                var chldHTML = '';
                if(n>current){
                  for (i=0; i < n-current; i++) {
                    $('.pax-select__child-ages').append(childSelect);
                    if(ages){
                      $('.pax-select__child-ages select').last().val(ages[i]);
                    }
                  }
                  $('.pax-select__child-ages').append(chldHTML);
                }else if (n<current) {
                  $('.pax-select__child-ages').children().slice(n, current).remove();
                }
              },

              printFixtures: function (fixtures) {
                if (!fixtures.length) {
                  return;
                }
                var fixtureList = '';

                fixtureList += '<div class="clearfix grid-row"><div class="col columns-12 push-container"><div class="text-box text-box--block"><table class="fixtureTable expandable-radio-list"><thead><tr><th>'+appConfig.tableLayout.opponent+'</th><th>'+appConfig.tableLayout.matchdate+'</th><th>'+s.team.basis+'</th><th>'+s.team.full+'</th><th>Informasjon</th></tr></thead><tbody>';


                fixtureList += this.fixtureCapasity(fixtures);

                fixtureList += '</tbody></table></div></div></div>';
                membership = (s.team.membership) ? '<input type="checkbox" class="checkbox__input" id="member" name="member"><label for="member">'+ s.team.membershipText + '</label><br/><br/>' : '';

                var bookingRow = '<tr id="fixtureBooking" class="expandable-radio-element__body"><td colspan="5"><div id="matchImage"><img src=""></div><div id="matchInfo"></div><div id="matchBooking">'+FootballFixtures.ui.paxSelectors()+'<div>'+membership+'<a class="button primary">'+appConfig.bookingText.buttonText+'</a><p>'+appConfig.bookingText.hotelNights+'</p></div></td></tr>';

                s.container.after(fixtureList);
                $('.fixtureTable tr:last').after(bookingRow);
                FootballFixtures.bindUIActions();


                var storage = JSON.parse(sessionStorage.getItem('footballFixture'));

                if(storage) {
                  if(storage.children!=''){
                    FootballFixtures.ui.paxSelectorsAges(storage.children.split(',').length,storage.children.split(','));
                  }
                }

                // Place booking dialogue at first available fixture
                if(storage) {
                  var storage = JSON.parse(sessionStorage.getItem('footballFixture'));
                  if($("#"+storage.fixture).is(":enabled")){
                    $("#"+storage.fixture).trigger("click");
                  }else {
                    $(".fixtureTable input[type=radio]:not(:disabled):first").trigger("click");
                  }
                }else{
                  $(".fixtureTable input[type=radio]:not(:disabled):first").trigger("click");
                }


              },


              fixtureCapasity: function(fixtures) {
                var disabledInput = disabledClass = '';
                /*if (!s.team.inSale) {
                  disabledInput =' disabled';
                  disabledClass = ' checkbox--disabled';
                }*/

                var fixtureList = '';
                for (i=fixtures.length-1; i >= 0; i--){
                  baseInputValue = fixtures[i].opponent+':'+dateConvert(fixtures[i].baseFromDate, appConfig.dateFormat)+':'+dateConvert(fixtures[i].baseToDate, appConfig.dateFormat)+':'+fixtures[i].baseStatus+':'+fixtures[i].opponentCode+':'+fixtures[i].baseInfo;
                  fullInputValue = fixtures[i].opponent+':'+dateConvert(fixtures[i].fullFromDate, appConfig.dateFormat)+':'+dateConvert(fixtures[i].fullToDate, appConfig.dateFormat)+':'+fixtures[i].fullStatus+':'+fixtures[i].opponentCode+':'+fixtures[i].fullInfo;

                  disabledInput = (fixtures[i].baseStatus=="sold out") ? ' disabled' : ''; //  || !s.team.inSale
                  disabledClass = (fixtures[i].baseStatus=="sold out") ? ' checkbox--disabled': ''; //  || !s.team.inSale

                  fixtureList += '<tr id='+i+' class="expandable-radio-element"><td data-th=""><img class="comp" src="https://www3.ving.no/VingNO/dev/football/build-0.2/assets/img/'+fixtures[i].competition+'.png" />' + fixtures[i].opponent + '</td><td>' + dateConvert(fixtures[i].matchDate, 'DDD') + ' ' + dateConvert(fixtures[i].matchDate, 'DD. MMM') + '</td>';


                  fixtureList += '<td data-th="'+s.team.basis+'"><label for="'+i+'base" class="kit-checkbox__label">' + FootballFixtures.checkCapasity(fixtures[i].baseStatus, fixtures[i].baseFromDate, fixtures[i].baseToDate) + '</label><input id="'+i+'base" class="checkbox checkbox--rounded'+disabledClass+'" type="radio" value="'+baseInputValue+'" name="match" '+disabledInput+'></td>';

                  disabledInput = (fixtures[i].fullStatus=="sold out") ? ' disabled' : ''; //  || !s.team.inSale
                  disabledClass = (fixtures[i].fullStatus=="sold out") ? ' checkbox--disabled' : ''; //  || !s.team.inSale

                  fixtureList += '<td data-th="'+s.team.full+'"><label for="'+i+'full" class="kit-checkbox__label">' + FootballFixtures.checkCapasity(fixtures[i].fullStatus, fixtures[i].fullFromDate, fixtures[i].fullToDate) + '</label><input id="'+i+'full" class="checkbox checkbox--rounded '+disabledClass+'" type="radio" value="'+fullInputValue+'" name="match" '+disabledInput+'></td></tr>';
                }
                return fixtureList;
              }
          },

          setup: {
              fixtures: function (team) {
                  $('body').append('loading ' + team + ' fixtures...');
              }
          }
      }

      FootballFixtures.testFunction = function(){
        console.log(this)
      }

      FootballFixtures.init( $('.maincontent .grid-row:nth-child(2)') );

      //FootballFixtures.settings(jsonData);
      //FootballFixtures.ui.debug('testing... 1 2 3');
      //FootballFixtures.setup.fixtures('MAN');



      var dateConvert = function (dateObject,format){
        var separators = ['\\\.', '\\\-', '\\\/'];
        //if (dateObject == '' || isNaN(dateObject)) { return '' };
        if (dateObject == '') { return '' };
        dateobj = dateObject.toString().split(new RegExp(separators.join('|'), 'g'));
        var newdate = new Date(dateobj[2],parseInt(dateobj[1])-1,dateobj[0]);
        var year = newdate.getFullYear();
        var month= ("0" + (newdate.getMonth()+1)).slice(-2);
        //if (month < 10) { month = "0" + month; }
        var date = ("0" + newdate.getDate()).slice(-2);
        var day = newdate.getDay();
        var months = appConfig.tableLayout.months;
        var dates = appConfig.tableLayout.days;
        var converted_date = "";
        switch(format){
          case "DD/MM":
          converted_date = date + "/" + month;
          break;
          case "DD. MMM":
          converted_date = date + ". " + months[parseInt(month-1)];
          break;
          case "DDD":
          converted_date = dates[parseInt(day)];
          break;
          case "DDMMYYYY":
          converted_date = date +''+month+''+year;
          break;
          case "YYYYMMDD":
          converted_date = year +'' + month + ''+ date;
          break;
        }
        return converted_date;
      }
  });
}(jQuery, window.FootballFixtures = window.FootballFixtures || {}));
