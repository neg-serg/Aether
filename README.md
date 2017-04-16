# Aether
###### ( lightdm-webkit-theme-aether )
Inspired by a lifelong love with space. 

A Sleek, straightforward Archlinux themed login screen written on lightdm and the lightdm-webkit2-greeter.

![](http://i.imgur.com/rxb1DSi.png)

## Table of Contents

- [Aether](#aether)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Setting an Avatar Image](#setting-an-avatar-image)
    - [Using Your Own Wallpapers](#using-your-own-wallpapers)
  - [Troubleshooting](#troubleshooting)
    - [My login screen hasn't changed!](#my-login-screen-hasnt-changed)
    - [My screen is black!](#my-screen-is-black)
    - [The lock screen isn't using my lightdm theme!](#the-lock-screen-isnt-using-my-lightdm-theme)
  - [Development](#development)
    - [Running Tests](#running-tests)
    - [Building Project](#building-project)
    - [Monitoring Changes](#monitoring-changes)
    - [Todo](#todo)
    - [Credit](#credits)

## Requirements
- [lightdm-webkit2-greeter (aur/lightdm-webkit2-greeter )](https://github.com/Antergos/lightdm-webkit2-greeter)

## Installation

**Recommended Automatic Installation**

[Available on the AUR](https://aur.archlinux.org/packages/lightdm-webkit-theme-aether/). ArchLinux users can substitute pacaur with yaourt, packer, etc. as necessary and install with the following:

```
pacaur -S lightdm-webkit-theme-aether
```

### **Setting an Avatar Image**

Once LightDM, LightDM Webkit Greeter, and Aether are installed you will need to set an avatar image for your users. Size is irrelevant, and avatars will be displayed as a 125x125 circle (Yes, square images too). Users that don't have an avatar set will default to the [astronaut](./src/img/default-user.png).

To accomplish this, you can do either of the following: 
- Create an image in your home directory named `.face`.
- Append `Icon=/path/to/your/avatar.png` to the bottom of the file at `/var/lib/AccountsService/users/<youraccountname>`

### **Using Your Own Wallpapers**

#### Method One:
Add and delete wallpapers within the `src/img/wallpapers/` directory as you see fit. By default, you will find this folder at the absolute path: `/usr/share/lightdm-webkit/themes/lightdm-webkit-theme-aether/src/img/wallpapers/`.

#### Method Two:
Edit the `background_images` value under `branding` within your lightdm-webkit config file located at `/etc/lightdm/lightdm-webkit2-greeter.conf`.
*Note: This ignores the default value of /usr/share/backgrounds, as this is always set and would prevent the default wallpapers from working. To use wallpapers from within that directory, create a subdirectory at /usr/share/backgrounds/aether (or any other folder name) and change your config value accordingly.*

## Troubleshooting

### The lock screen isn't using my lightdm theme!

If you are using cinnamon, gnome, or any gnome derivative; Good Luck. The solution involves [light-locker (community/light-locker)](https://github.com/the-cavalry/light-locker), but conflicts with the existing lock / screensaver applications. There is no known way to resolve this.

If you are not using a gnome derivative, see below.

Solution:

```
echo "light-locker &" >> ~/.xprofile
```

## Development

Make sure you have [Node](https://nodejs.org/en/) installed.

- `sudo npm install -g webpack`
- `npm install` *(While in project directory)*

### Running Tests
```
npm run test
```

### Building Project
```
# Note: Automatically runs tests first.
npm run build
```

### Monitoring Changes
```
# Automatically detects and re-compiles changes.
npm run watch
```

##### Credit
- *Bear by Yu luck from the Noun Project*
- *Power by Nikita Kozin from the Noun Project*
