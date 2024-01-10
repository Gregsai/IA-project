class Tournament {
    constructor(organizer, name, discipline, date, maxParticipants, applicationDeadline, rankedPlayers, address, seedingType) {
      this.organizer = organizer;
      this.name = name;
      this.discipline = discipline;
      this.date = date;
      this.maxParticipants = maxParticipants;
      this.applicationDeadline = applicationDeadline;
      this.rankedPlayers = rankedPlayers;
      this.address = address;
      this.seedingType = seedingType;
    }
  }
  
  module.exports = Tournament;