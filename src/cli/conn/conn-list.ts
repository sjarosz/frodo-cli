import { Command, Option } from 'commander';
import { ConnectionProfile } from '@rockcarver/frodo-lib';
import { init } from '../cmd_common.js';

const { listConnectionProfiles } = ConnectionProfile;

// pseudo init to trigger print and progress handler registration
init();

const program = new Command('frodo conn list');

program
  .description('List connection profiles.')
  .helpOption('-h, --help', 'Help')
  .showHelpAfterError()
  .addOption(
    new Option('-l, --long', 'Long with all fields.').default(false, 'false')
  )
  .action(
    // implement command logic inside action handler
    async (options) => {
      listConnectionProfiles(options.long);
    }
    // end command logic inside action handler
  );

program.parse();
