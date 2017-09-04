(function($, FootballFixtures, undefined) {
  $(document).ready(function() {
    //$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://www.ving.no/Handlers/ContentHandler.ashx?h=fbeb34355a97862ff19d19484c0ac9998d2a38ad&s=3&f=2&c=common') );


    var s,
      FootballFixtures = {
        settings:
          {
            teams: []
            /*{
              name: getTeam()
              data: appConfig.teams[getTeam()] || appConfig.nextFixtureList.teams,
              spreadsheet: []
            }*/

          },

          init: function(container) {
            s = this.settings;
            s.container = container;

            if (appConfig.teams[getTeam()]) {
              s.teams.push({
                'name': getTeam(),
                'data': appConfig.teams[getTeam()],
                'spreadsheet': 'https://spreadsheets.google.com/feeds/list/' + appConfig.sheetID + '/' + appConfig.teams[getTeam()].pagenr + '/public/basic?hl=en_US&alt=json-in-script',
                'fixtures': []
              });

              // Må flyttes
              if (s.teams[0].data.salesInfo) {
                $(container).append('<div class="clearfix grid-row"><div class="message-box information expand" data-reactid="60"><div class="text left" data-reactid="61"><span class="icon left tcneicon-info" data-reactid="62"></span><span class="message-text left" data-reactid="63">' + s.teams.data.salesInfo + '</span></div></div></div>');
              }

            } else {
              $.each(appConfig.nextFixtureList.teams, function(i, val) {
                s.teams.push({
                  'name': appConfig.nextFixtureList.teams[i][0],
                  'data': appConfig.teams[appConfig.nextFixtureList.teams[i][0]],
                  'spreadsheet': 'https://spreadsheets.google.com/feeds/list/' + appConfig.sheetID + '/' + appConfig.teams[val[0]].pagenr + '/public/basic?hl=en_US&alt=json-in-script',
                  'fixtures': []
                })
              });
            }

            /*if (container.length) {
              s.container = container;
                $.each(s.content, function(i, val) {
                  console.log(s);
                  console.log(i + ' ' + val);
                  s.teams.push({
                    'name': s.content[i],
                    'data': appConfig.teams[s.content[i]],
                    'spreadsheet': 'https://spreadsheets.google.com/feeds/list/' + appConfig.sheetID + '/' + appConfig.teams[val].pagenr + '/public/basic?hl=en_US&alt=json-in-script'
                  })
                });
              /*} else {
                s.teams.spreadsheet.push('https://spreadsheets.google.com/feeds/list/' + appConfig.sheetID + '/' + s.teams.data.pagenr + '/public/basic?hl=en_US&alt=json-in-script');
              }*/
              /*} else {
                  FootballFixtures.ui.debug(' --> Container ' + container + ' does not exist, or team[s] not defined');
                  return;
              }*/
            //};
            FootballFixtures.loadFixtures(s);


          },

          bindUIActions: function() {
            $('.grid-section').on('change', 'input:radio', function() {

              fixtureData = this.value.split(':');
              var row = $(this).closest('tr');
              if (row.next().attr('id') != $('tr#fixtureBooking').attr('id')) {

                if (fixtureData[6] != '-' && fixtureData[6] != 'undefined') {
                  membership = '<div id="condition"><input type="checkbox" class="checkbox__input" id="member" name="member"><label for="member">' + fixtureData[6] + '</label><br/><br/></div>';
                  $(membership).insertBefore('tr#fixtureBooking #matchBooking a');
                } else {
                  $('#condition').remove();
                }

                $('tr#fixtureBooking').insertAfter(row);
              }



              $('#matchImage img').attr('src', '//images2.ving.no/images/Hotel/H' + s.teams[0].data.img + fixtureData[4] + FootballFixtures.getFixtureImage(s.teams[0].data.img, fixtureData[4]));

              if (fixtureData[5] != '-') {
                $('#matchInfo').html(fixtureData[5]);
              } else {
                $('#matchInfo').html('');
              }
              (fixtureData[3].toLowerCase() == "ineligible") ? $('#matchBooking').hide(): $('#matchBooking').show();
            });

            $('.pax-select__child-selector select').on('change', function() {
              FootballFixtures.ui.paxSelectorsAges(this.value);
            });

            $('#fixtureBooking a').on('click', function() {
              var adults = '42,'.repeat(parseInt($('.pax-select__adult-selector select').val()));
              var children = getChildren($('.pax-select__child-selector select').val());
              var QueryRoomAges = adults + '' + children;

              function getChildren(children) {
                var childAges = '';
                $('.pax-select__child-ages').find('select').each(function() {
                  if (this.value != -1) {
                    childAges += this.value + ',';
                  }
                });
                return childAges.slice(0, -1);
              }

              searchvars = $('input[type=radio]:checked').val().split(':');

              url = 'https://' + window.location.hostname + '' + appConfig.hotelPageURL + '?QueryDepID=-1&QueryCtryID=' + s.teams[0].data.ctryid + '&QueryAreaID=0&QueryResID=' + s.teams[0].data.resid + '&QueryDestID=0&QueryChkInDate=' + searchvars[1] + '&QueryChkOutDate=' + searchvars[2] + '&QueryDepDate=00010101&QueryRetDate=00010101&QueryDur=NaN&CategoryId=6&QueryRoomAges=|' + QueryRoomAges + '&QueryUnits=1';

              if (!$('#member').length || $('#member').is(':checked')) {
                var data = JSON.stringify({
                  team: s.teams[0].data.teamCode,
                  fixture: $('input[type=radio]:checked').attr('id'),
                  adults: adults,
                  children: children
                });
                sessionStorage.setItem('footballFixture', data);
                window.location = url;
              } else {
                alert(appConfig.bookingText.membershipError);
              }

              //console.log(burl);
            })
          },

          getFixtureImage: function(team, opponent) {
            end = '1001_6_16.jpg';
            if (opponent == "SOUT") {
              end = '1001_5_16.jpg';
            } else if (team == "MAN" && opponent == "HUDD") {
              end = '1001_8_17.jpg';
            } else if (team == "MAN" && opponent == "WESH") {
              end = '1001_6_16.jpg';
            } else if (team == "LPL" && opponent== "WESH") {
              end = '1001_7_20.jpg';
            } else if (team == "MAN" && opponent == "WEBR") {
              end = '1001_4_16.jpg';
            } else if (team == "MAN" && opponent == "CHEL") {
              end = '1001_4_16.jpg';
            }
            return end;
          },

          checkCapasity: function(status, from, to) {
            if (status != "sold out") {
              return dateConvert(from, 'DD/MM') + '-' + dateConvert(to, 'DD/MM');
            } else {
              return appConfig.bookingText.soldout;
            }
          },

          loadFixtures: function(settings) {
            var xhrs = [];
            $.each(settings.teams, function(index, value) {
              var xhr = $.ajax({
                type: 'GET',
                url: settings.teams[index].spreadsheet,
                dataType: 'jsonp',
                error: function(jqXHR, textStatus, errorThrown, statusCode) {
                  FootballFixtures.ui.debug(jqXHR);
                },
                //success: this.formatFixtures
              });
              xhrs.push(xhr)
            });

            $.when.apply($, xhrs).done(function() {
              FootballFixtures.formatFixtures(xhrs, settings)
            });
          },

          formatFixtures: function(xhrs, s) {
            //if (xhrs.length < 2) {
              for (i = 0; i < xhrs.length; i++) {
                data = xhrs[i].responseJSON;

                var fixture = [];
                var fixtures = [];
                var tm = new Team(s.teams[i].name, s.teams[i].data);

                if (data.feed.entry) {
                  $.each(data.feed.entry, function(index, sheetRow) {
                    fixture = ['id: '+sheetRow.title.$t];
                    fixture += ','+sheetRow.content.$t.split(', ');
                    fixture = fixture.split(',');

                    if (fixture.length < 12) {
                      FootballFixtures.ui.debug('Fixtures not loaded. Error in spreadsheet.');
                      return;
                    } else {
                      tm.addFixture(fixture, index);
                    }
                  });

                  tm.fixtures = tm.getFixtures(s.team);
                  s.teams[i].fixtures = tm.fixtures;
                  //FootballFixtures.ui.printFixtures(tm);
                } else {
                  FootballFixtures.ui.debug('Fixtures not loaded. data.feed.entry is empty.');
                }
              }
              FootballFixtures.ui.printFixtures(s);
          },

          sortFixtures: function(fixtures) {
            data.fixtures = data.fixtures.sort(function(a, b) {
              return (a[5] > b[5]) ? 1 : ((a[5] < b[5]) ? -1 : 0);
            });
          },

          ui: {
            debug: function(info) {
              console.log(info);
            },

            paxSelectors: function() {
              var paxContainer = '<div class="pax-select" style="float: left;"><div class="pax-select__room">';

              var paxContainerAdults = '<div class="pax-select__adult-selector simple-select"><label class="simple-select__label">' + appConfig.bookingText.adults + '</label><div class="simple-select__arrow"></div><select>';

              var paxContainerChildren = '<div class="pax-select__child-selector simple-select"><label class="simple-select__label">' + appConfig.bookingText.children + '</label><div class="simple-select__arrow"></div><select>';

              for (i = 0; i <= 6; i++) {
                var selected = '';
                (i == 2) ? selected = ' selected': selected = '';
                paxContainerAdults += '<option value="' + i + '"' + selected + '> ' + i + ' </option>';

                (i == 0) ? selected = ' selected': selected = '';
                paxContainerChildren += '<option value="' + i + '"' + selected + '> ' + i + ' </option>';
              }

              return paxContainer.concat(paxContainerAdults, '</select></div>', paxContainerChildren, '</select></div></div><div class="pax-select__child-ages"></div><div class="pax-information"></div></div>');
            },

            paxSelectorsAges: function(n, ages) {
              var current = $('.pax-select__child-ages').children().length;
              var childSelect = '<div class="pax-select__child-age-selector simple-select"><label class="simple-select__label">' + appConfig.bookingText.childAge + '</label><div class="simple-select__arrow"></div><select><option value="-1"> ' + appConfig.bookingText.choose + ' </option>';
              for (i = 0; i < 18; i++) {
                childSelect += '<option value="' + i + '"> ' + i + ' ' + appConfig.bookingText.year + ' </option>';
              }
              childSelect += '</select></div>';


              if (ages && ages[0] != '') {
                $('.pax-select__child-selector select').val(ages.length)
              };
              var chldHTML = '';
              if (n > current) {
                for (i = 0; i < n - current; i++) {
                  $('.pax-select__child-ages').append(childSelect);
                  if (ages) {
                    $('.pax-select__child-ages select').last().val(ages[i]);
                  }
                }
                $('.pax-select__child-ages').append(chldHTML);
              } else if (n < current) {
                $('.pax-select__child-ages').children().slice(n, current).remove();
              }
            },

            printFixtures: function(s) {
              if (s.teams.length < 2) {
                var fixtures = s.teams[0].fixtures;

                if (!fixtures.length) {
                  return;
                }

                var fixtureList = '<div class="clearfix grid-row"><div class="col columns-12 push-container"><div class="text-box text-box--block"><table class="fixtureTable expandable-radio-list"><thead><tr><th>' + appConfig.tableLayout.opponent + '</th><th>' + appConfig.tableLayout.matchdate + '</th><th>' + s.teams[0].data.basis + '</th><th>' + s.teams[0].data.full + '</th><th>Informasjon</th></tr></thead><tbody>';


                fixtureList += this.fixtureCapasity(fixtures);

                fixtureList += '</tbody></table></div></div></div>';
                membership = (s.teams[0].data.membership) ? '<input type="checkbox" class="checkbox__input" id="member" name="member"><label for="member">' + s.teams[0].data.membershipText + '</label><br/><br/>' : '';

                var bookingRow = '<tr id="fixtureBooking" class="expandable-radio-element__body"><td colspan="5"><div id="matchImage"><img src=""></div><div id="matchInfo"></div><div id="matchBooking">' + FootballFixtures.ui.paxSelectors() + '<div>' + membership + '<a class="button primary">' + appConfig.bookingText.buttonText + '</a><p>' + appConfig.bookingText.hotelNights + '</p></div></td></tr>';

                s.container.after(fixtureList);
                $('.fixtureTable tr:last').after(bookingRow);
                FootballFixtures.bindUIActions();

                var storage = JSON.parse(sessionStorage.getItem('footballFixture'));

                if (storage) {
                  if (storage.children != '') {
                    FootballFixtures.ui.paxSelectorsAges(storage.children.split(',').length, storage.children.split(','));
                  }
                }

                // Place booking dialogue at first available fixture
                if (storage) {
                  var storage = JSON.parse(sessionStorage.getItem('footballFixture'));
                  if ($("#" + storage.fixture).is(":enabled")) {
                    $("#" + storage.fixture).trigger("click");
                  } else {
                    $(".fixtureTable input[type=radio]:not(:disabled):first").trigger("click");
                  }
                } else {
                  $(".fixtureTable input[type=radio]:not(:disabled):first").trigger("click");
                }

                if(window.location.hash) {
                  hash=window.location.hash.substring(1);
                  $(".fixtureTable tr#"+hash+" input[type=radio]:not(:disabled):first").trigger("click");
                }

              }else if (appConfig.nextFixtureList.display) {{
                  var nextFixtures;
                  $.each(s.teams, function(index, team) {
                    fids = appConfig.nextFixtureList.teams.shift()[1];
                    $.each(fids, function(j, fid){
                      var i = team.fixtures.length;
                      while (i--) {
                        if (team.fixtures[i].id != fid){ // || team.fixtures[i].baseStatus != 'in sale' || team.fixtures[i].fullStatus != 'in sale'
                          team.fixtures.splice(i,1);
                        }else {
                          if (team.fixtures[i].baseStatus != 'in sale' && team.fixtures[i].fullStatus != 'in sale') {
                            team.fixtures.splice(i,1);
                          }
                        }
                      }
                    });
                  });

                  var nextFixturesHTMLContent = '';

                  $.each(s.teams, function(i, team){
                    nextFixturesHTMLContent += '<div class="col columns-4  push-container" data-area="row:4,area:'+i+'"><div> \
                      <div class="textpush textpush--small "> \
                        <div class="textpush__image image-container--contain"> \
                          <a href="'+ appConfig.teamPrefixURL + '/' + team.name + '#' + team.fixtures[0].id +'" target="_self"> \
                            <picture> \
                              <img  src="//images2.ving.no/images/Hotel/H' + team.data.img  + team.fixtures[0].opponentCode + FootballFixtures.getFixtureImage(team.data.img, team.fixtures[0].opponentCode) + '" alt=""> \
                            </picture> \
                          </a> \
                        </div> \
                        <div class="textpush__content"> \
                          <center><a href="'+ appConfig.teamPrefixURL + '/' + team.name + '#' + team.fixtures[0].id +'" target="_self" class="textpush__header">' + team.data.teamName + '<br/> <span style="font-size:10px;color:#999">vs</span> <br/>' + team.fixtures[0].opponent + '</a></center> \
                          <div class="textpush__text-content"> \
                            <div class="textpush__desktop-content">  \
                              <p>' + dateConvert(team.fixtures[0].matchDate, 'DD. MMM') + '</p> \
                            </div> \
                            <div class="textpush__mobile-content"> \
                              <p>' + dateConvert(team.fixtures[0].matchDate, 'DD. MMM') + '</p> \
                            </div> \
                          </div> \
                          <div class="textpush__readmore-arrow tcneicon-arrow-right "></div> \
                          <div class="text-push__button-container"> \
                            <div class="text-box-btn-margin"> \
                              <a href="'+ appConfig.teamPrefixURL + '/' + team.name + '#' + team.fixtures[0].id +'" target="_self" class="button primary">' + appConfig.nextFixtureList.buttonText + '</a> \
                            </div> \
                          </div> \
                        </div> \
                      </div> \
                    </div></div>';
                  });

                  nextFixturesHTML = '<div class="clearfix grid-row"><div class="col columns-12  push-container " data-area="row:3,area:0"><div><h2 class="sectionheadline tcne-separator thomasheadlinelight">'+ appConfig.nextFixtureList.header +'</h2></div></div></div><div class="clearfix grid-row row-advanced-push--Default row-text-push--Standard">'+ nextFixturesHTMLContent +'</div>';
                  s.container = $(appConfig.nextFixtureList.container);
                  s.container.after(nextFixturesHTML);
                }
              }
            },


            fixtureCapasity: function(fixtures) {
              var disabledInput = disabledClass = '';
              /*if (!s.team.inSale) {
                disabledInput =' disabled';
                disabledClass = ' checkbox--disabled';
              }*/

              var fixtureList = '';
              for (i = fixtures.length - 1; i >= 0; i--) {
                baseInputValue = fixtures[i].opponent + ':' + dateConvert(fixtures[i].baseFromDate, appConfig.dateFormat) + ':' + dateConvert(fixtures[i].baseToDate, appConfig.dateFormat) + ':' + fixtures[i].baseStatus + ':' + fixtures[i].opponentCode + ':' + fixtures[i].baseInfo + ':' + fixtures[i].condition;
                fullInputValue = fixtures[i].opponent + ':' + dateConvert(fixtures[i].fullFromDate, appConfig.dateFormat) + ':' + dateConvert(fixtures[i].fullToDate, appConfig.dateFormat) + ':' + fixtures[i].fullStatus + ':' + fixtures[i].opponentCode + ':' + fixtures[i].fullInfo + ':' + fixtures[i].condition;

                disabledInput = (fixtures[i].baseStatus == "sold out") ? ' disabled' : ''; //  || !s.team.inSale
                disabledClass = (fixtures[i].baseStatus == "sold out") ? ' checkbox--disabled' : ''; //  || !s.team.inSale

                fixtureList += '<tr id=' + fixtures[i].id + ' class="expandable-radio-element"><td data-th=""><img class="comp" src="https://www3.ving.no/VingNO/dev/football/assets/img/' + fixtures[i].competition + '.png" />' + fixtures[i].opponent + '</td><td>' + dateConvert(fixtures[i].matchDate, 'DDD') + ' ' + dateConvert(fixtures[i].matchDate, 'DD. MMM') + '</td>';


                fixtureList += '<td data-th="' + s.teams[0].data.basis + '"><label for="' + i + 'base" class="kit-checkbox__label">' + FootballFixtures.checkCapasity(fixtures[i].baseStatus, fixtures[i].baseFromDate, fixtures[i].baseToDate) + '</label><input id="' + i + 'base" class="checkbox checkbox--rounded' + disabledClass + '" type="radio" value="' + baseInputValue + '" name="match" ' + disabledInput + '></td>';

                disabledInput = (fixtures[i].fullStatus == "sold out") ? ' disabled' : ''; //  || !s.team.inSale
                disabledClass = (fixtures[i].fullStatus == "sold out") ? ' checkbox--disabled' : ''; //  || !s.team.inSale

                fixtureList += '<td data-th="' + s.teams[0].data.full + '"><label for="' + i + 'full" class="kit-checkbox__label">' + FootballFixtures.checkCapasity(fixtures[i].fullStatus, fixtures[i].fullFromDate, fixtures[i].fullToDate) + '</label><input id="' + i + 'full" class="checkbox checkbox--rounded ' + disabledClass + '" type="radio" value="' + fullInputValue + '" name="match" ' + disabledInput + '></td></tr>';
              }
              return fixtureList;
            }
          },

          setup: {
            fixtures: function(team) {
              $('body').append('loading ' + team + ' fixtures...');
            }
          }
      }

    FootballFixtures.testFunction = function() {
      console.log(this)
    }

    FootballFixtures.init($('.maincontent .grid-row:nth-child(2)'));

    //FootballFixtures.settings(jsonData);
    //FootballFixtures.ui.debug('testing... 1 2 3');
    //FootballFixtures.setup.fixtures('MAN');


    String.prototype.repeat = function(times) {
      return (new Array(times + 1)).join(this);
    };

    function getTeam() {
      var levels = window.location.pathname.split('/');
      var teamURL = levels[levels.length - 1];
      return teamURL;
    }

    var dateConvert = function(dateObject, format) {
      var separators = ['\\\.', '\\\-', '\\\/'];
      //if (dateObject == '' || isNaN(dateObject)) { return '' };
      if (dateObject == '') {
        return ''
      };
      dateobj = dateObject.toString().split(new RegExp(separators.join('|'), 'g'));
      var newdate = new Date(dateobj[2], parseInt(dateobj[1]) - 1, dateobj[0]);
      var year = newdate.getFullYear();
      var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
      //if (month < 10) { month = "0" + month; }
      var date = ("0" + newdate.getDate()).slice(-2);
      var day = newdate.getDay();
      var months = appConfig.tableLayout.months;
      var dates = appConfig.tableLayout.days;
      var converted_date = "";
      switch (format) {
        case "DD/MM":
          converted_date = date + "/" + month;
          break;
        case "DD. MMM":
          converted_date = date + ". " + months[parseInt(month - 1)];
          break;
        case "DDD":
          converted_date = dates[parseInt(day)];
          break;
        case "DDMMYYYY":
          converted_date = date + '' + month + '' + year;
          break;
        case "YYYYMMDD":
          converted_date = year + '' + month + '' + date;
          break;
      }
      return converted_date;
    }
  });
}(jQuery, window.FootballFixtures = window.FootballFixtures || {}));
