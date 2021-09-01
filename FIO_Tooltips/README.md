This is a TamperMonkey script that provides Exchange data in tooltip form for Inventories in the Apex console.  This data is pulled every 5 minutes from the FIO ReST API created by Saganaki and Kovus (plus many other contributors and testers) 

![Image of Plugin](https://i.imgur.com/L1JyHwq.png)

### Requirements
* [TamperMonkey](https://www.tampermonkey.net/) - browser plugin for sideloading JS in to current page.

### How to Install
* Click TamperMonkey menu in Browser
* Click 'Create a new script...'
* Paste contents of 'PrUnTools_FIO_Tooltips.js'
* Ctrl+S to save.
* Reload Apex

### How to Use
* Tooltips are enabled by default, this is indicated by the FIO-TP button with a green glow
* If you need to disable them it can be achieved by disabling the script in TamperMonkey


### Configure AutoUpdates
* Open script in TamperMonkey by clicking on TamperMonkey Icon in browser
* Click 'Dashboard'
* Click 'PrUnTools_FIO_Tooltips', which opens the editor
* Click on bottom most 'Settings' tab
* Check 'Check for Updates'
* Verify 'Update URL' matches the @updateURL parameter in editor
* Click 'Save'

### Check for updates (All scripts)
* Open script in TamperMonkey by clicking on TamperMonkey Icon in browser
* Utilities -> Check for Userscript updates

### Check for updates (single script)
* Open script in TamperMonkey by clicking on TamperMonkey Icon in browser
* Click 'Dashboard'
* Click 'PrUnTools_FIO_Tooltips', which opens the editor
* In editor click File -> Check for Updates