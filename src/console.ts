/* eslint-disable no-console */

import { AppModule } from '@app/app.module';
import { BootstrapConsole } from 'nestjs-console';
import { CommanderError } from 'commander';
import { SetupService } from '@app/setup/setup.service';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
  contextOptions: { logger: false },
});

bootstrap.init().then(async app => {
  try {
    await app.init();
    const service = bootstrap.getService();

    // Add extra command in top level commander instance
    const cli = service.getCli();
    service.createCommand(
      {
        command: 'setup',
        description: 'Setup application',
      },
      async () => {
        const setupService = app.get(SetupService);
        await setupService.init();
      },
      cli,
    );

    cli.exitOverride();
    cli.commands.forEach(command => {
      command.exitOverride();
    });

    await bootstrap.boot();
    await app.close();
  } catch (e) {
    await app.close();

    if (e instanceof CommanderError) {
      let { exitCode } = e;
      if (e.code === 'commander.help') {
        exitCode = 0;
      }

      process.exit(exitCode);
    } else {
      console.error(e);
      process.exit(1);
    }
  }
});
