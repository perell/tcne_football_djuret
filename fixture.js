function Fixture(team, data) {
    this.team = team;
    this.opponent = data[0].split(': ')[1];
    this.opponentCode = data[1].split(': ')[1];
    this.matchDate = data[2].split(': ')[1];
    this.baseFromDate = data[3].split(': ')[1];
    this.baseToDate = data[4].split(': ')[1];
    this.baseStatus = data[5].split(': ')[1];
    this.baseInfo = data[6].split(': ')[1];
    this.fullFromDate = data[7].split(': ')[1];
    this.fullToDate = data[8].split(': ')[1];
    this.fullStatus = data[9].split(': ')[1];
    this.fullInfo = data[10].split(': ')[1];
    this.competition = data[11].split(': ')[1];
}

Fixture.prototype.visit = function() {

}
