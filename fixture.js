function Fixture(team, data) {
  try {
    this.team = team;
    this.id = data[0].split(': ')[1];
    this.opponent = data[1].split(': ')[1];
    this.opponentCode = data[2].split(': ')[1];
    this.matchDate = data[3].split(': ')[1];
    this.baseFromDate = data[4].split(': ')[1];
    this.baseToDate = data[5].split(': ')[1];
    this.baseStatus = data[6].split(': ')[1];
    this.baseInfo = data[7].split(': ')[1];
    this.fullFromDate = data[8].split(': ')[1];
    this.fullToDate = data[9].split(': ')[1];
    this.fullStatus = data[10].split(': ')[1];
    this.fullInfo = data[11].split(': ')[1];
    this.competition = data[12].split(': ')[1];
    this.basePrice = data[13].split(': ')[1];
    this.fullPrice = data[14].split(': ')[1];
    this.condition = data[15].split(': ')[1];
  }catch(e){

  }
}

Fixture.prototype.visit = function() {

}
