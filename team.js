function Team(name, settings){
    this.name = name;
    this.settings = settings;
    this.fixtures = [];
}

Team.prototype.getFixtures = function() {
    return(this.fixtures);
}

Team.prototype.addFixture = function(val, index) {
    var f = new Fixture(this.name, val, index);
    this.fixtures.push(f);
}
