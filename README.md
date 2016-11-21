#Paycom Login Chrome Extension 


###To Install:

1. Download project as zip file
2. On chrome navigate to "chrome://extensions"
3. On upper right corner select "Develop Mode" checkbox
4. Click "Load unpacked extensions" and select the downloaded zip file
5. Ensure extension is enabled
6. Extension should now appear in chrome tool bar
7. Click on Paycom extension icon in tool bar

###To login: 

1. Click on extension to open pop-up

  ![alt tag](/images/extension-pic-2.png)
2. Click "Update Login Info" and add in login details

  ![alt tag](/images/extension-pic-1.png)
3. Once information has been stored in app, you can now click "Login" at any time for one-click login!

###Features:

1. Autologin to paycom
2. Login details are encrypted, you can change the salt message in login-form.js and timeClock.js 
3. On paycom webclock page new clock added in to show time worked that day and time to next 15 minute interval

![alt tag](/images/extension-pic-3.png)

###Future Updates:

1. Add in total time worked in the current week
2. Take into account multiple signins/outs per day
3. Publish extension to chrome store
4. Add in clock directly to the extension instead of having to constantly login to paycom and editing page
5. Autologin on popup modal when session timesout.

###Collaboration:

1. Please suggest improvements and any bugs
2. Make pull requests for any changes you have made
