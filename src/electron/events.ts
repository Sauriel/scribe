import { ipcMain } from "electron";
import { getFonts } from 'font-list'

ipcMain.on("loadFonts", (event, arg) => {
  getFonts({ disableQuoting: true })
    .then(fonts => {
      event.reply("fontsLoaded", fonts);
    })
    .catch(error => {
      console.error("Could not load fonts.", error);
    });
});