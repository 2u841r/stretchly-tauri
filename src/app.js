class StretchlyApp {
    constructor() {
        this.settings = {
            // General settings
            openAtLogin: false,
            fullscreen: false,
            showIdeas: true,
            allScreens: false,
            monitorIdleTime: false,
            monitorDnd: false,
            language: 'en',
            
            // Mini breaks
            enableMiniBreaks: true,
            microbreakDuration: 20,
            microbreakInterval: 20,
            showNotificationBeforeMiniBreak: true,
            enablePostponeMini: true,
            enableStrictMini: false,
            
            // Long breaks
            enableLongBreaks: true,
            breakDuration: 5,
            breakInterval: 34,
            showNotificationBeforeLongBreak: true,
            enablePostponeLong: true,
            enableStrictLong: false,
            
            // Theme
            mainColor: '#478484',
            transparentMode: false,
            enableSounds: true,
            audio: 'crystal-glass',
            useMonochromeTrayIcon: false,
            
            // Other
            checkNewVersion: true
        }
        
        this.currentBreak = null
        this.timer = null
        this.breakTimer = null
        this.isPaused = false
        this.nextBreakTime = null
        
        this.initializeApp()
    }

    async initializeApp() {
        await this.loadSettings()
        this.setupEventListeners()
        this.showScreen('welcome')
        this.applyTheme() // Apply initial theme
    }

    async loadSettings() {
        try {
            // For now, just use default settings
            // In a real Tauri app, this would load from file system
            console.log('Loading default settings')
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }

    async saveSettings() {
        try {
            // For now, just log the settings
            // In a real Tauri app, this would save to file system
            console.log('Saving settings:', this.settings)
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    async loadSystemInfo() {
        try {
            // Try to get system info from Tauri if available
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                const systemInfo = await invoke('get_system_info')
                const appVersion = await invoke('get_app_version')
                
                document.querySelector('.version').textContent = appVersion
                document.querySelector('.latestVersion').textContent = appVersion
            }
        } catch (error) {
            console.error('Error loading system info:', error)
        }
    }

    setupEventListeners() {
        // Titlebar controls
        document.getElementById('minimize-window-btn').addEventListener('click', () => {
            this.minimizeWindow()
        })

        document.getElementById('maximize-window-btn').addEventListener('click', () => {
            this.maximizeWindow()
        })

        document.getElementById('close-window-btn').addEventListener('click', () => {
            this.closeWindow()
        })

        // Welcome screen
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startBreaks()
            this.showScreen('main')
        })

        document.getElementById('preferences-btn').addEventListener('click', () => {
            this.showScreen('preferences')
        })

        // Main screen
        document.getElementById('start-break-btn').addEventListener('click', () => {
            this.startBreak()
        })

        document.getElementById('skip-btn').addEventListener('click', () => {
            this.skipBreak()
        })

        document.getElementById('postpone-btn').addEventListener('click', () => {
            this.postponeBreak()
        })

        // Minimize button
        document.getElementById('minimize-btn').addEventListener('click', () => {
            this.minimizeToTray()
        })

        // Break screen
        document.getElementById('finish-break-btn').addEventListener('click', () => {
            this.finishBreak()
        })

        document.getElementById('skip-break-btn').addEventListener('click', () => {
            this.skipBreak()
        })

        // Preferences screen
        document.getElementById('save-preferences-btn').addEventListener('click', () => {
            this.savePreferences()
        })

        document.getElementById('close-preferences-btn').addEventListener('click', () => {
            this.showScreen('main')
        })

        // Preferences navigation
        document.querySelectorAll('.navigation a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                this.switchPreferenceSection(e.target.closest('a').dataset.section)
            })
        })

        // Settings form elements
        this.setupSettingsEventListeners()
        
        // Load preference values
        this.loadPreferenceValues()
    }

    async minimizeWindow() {
        try {
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                await invoke('minimize_window')
            }
        } catch (error) {
            console.error('Error minimizing window:', error)
        }
    }

    async maximizeWindow() {
        try {
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                await invoke('maximize_window')
            }
        } catch (error) {
            console.error('Error maximizing window:', error)
        }
    }

    async closeWindow() {
        try {
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                await invoke('close_window')
            }
        } catch (error) {
            console.error('Error closing window:', error)
        }
    }

    setupSettingsEventListeners() {
        // General settings
        document.getElementById('openAtLogin').addEventListener('change', (e) => {
            this.settings.openAtLogin = e.target.checked
        })

        document.getElementById('window').addEventListener('change', (e) => {
            this.settings.fullscreen = false
        })

        document.getElementById('fullscreen').addEventListener('change', (e) => {
            this.settings.fullscreen = true
        })

        document.getElementById('showIdeas').addEventListener('change', (e) => {
            this.settings.showIdeas = e.target.checked
        })

        document.getElementById('allScreens').addEventListener('change', (e) => {
            this.settings.allScreens = e.target.checked
        })

        document.getElementById('monitorIdleTime').addEventListener('change', (e) => {
            this.settings.monitorIdleTime = e.target.checked
        })

        document.getElementById('monitorDnd').addEventListener('change', (e) => {
            this.settings.monitorDnd = e.target.checked
        })

        document.getElementById('language').addEventListener('change', (e) => {
            this.settings.language = e.target.value
        })

        // Mini breaks
        document.getElementById('enableMiniBreaks').addEventListener('change', (e) => {
            this.settings.enableMiniBreaks = e.target.checked
        })

        document.getElementById('miniBreakFor').addEventListener('input', (e) => {
            this.settings.microbreakDuration = parseInt(e.target.value) / 1000
            this.updateRangeOutput(e.target)
        })

        document.getElementById('miniBreakEvery').addEventListener('input', (e) => {
            this.settings.microbreakInterval = parseInt(e.target.value) / 60000
            this.updateRangeOutput(e.target)
        })

        document.getElementById('showNotificationBeforeMiniBreak').addEventListener('change', (e) => {
            this.settings.showNotificationBeforeMiniBreak = e.target.checked
        })

        document.getElementById('enablePostponeMini').addEventListener('change', (e) => {
            this.settings.enablePostponeMini = e.target.checked
        })

        document.getElementById('enableStrictMini').addEventListener('change', (e) => {
            this.settings.enableStrictMini = e.target.checked
        })

        // Long breaks
        document.getElementById('enableLongBreaks').addEventListener('change', (e) => {
            this.settings.enableLongBreaks = e.target.checked
        })

        document.getElementById('longBreakFor').addEventListener('input', (e) => {
            this.settings.breakDuration = parseInt(e.target.value) / 60000
            this.updateRangeOutput(e.target)
        })

        document.getElementById('longBreakEvery').addEventListener('input', (e) => {
            this.settings.breakInterval = parseInt(e.target.value)
            this.updateRangeOutput(e.target)
        })

        document.getElementById('showNotificationBeforeLongBreak').addEventListener('change', (e) => {
            this.settings.showNotificationBeforeLongBreak = e.target.checked
        })

        document.getElementById('enablePostponeLong').addEventListener('change', (e) => {
            this.settings.enablePostponeLong = e.target.checked
        })

        document.getElementById('enableStrictLong').addEventListener('change', (e) => {
            this.settings.enableStrictLong = e.target.checked
        })

        // Theme settings
        document.querySelectorAll('input[name="mainColor"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.mainColor = e.target.value
                this.applyTheme()
            })
        })

        document.getElementById('enableTransparency').addEventListener('change', (e) => {
            this.settings.transparentMode = e.target.checked
            this.applyTheme()
        })

        document.getElementById('enableSounds').addEventListener('change', (e) => {
            this.settings.enableSounds = e.target.checked
        })

        document.querySelectorAll('input[name="audio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.audio = e.target.value
            })
        })

        // Restore defaults
        document.getElementById('restoreDefaults').addEventListener('click', () => {
            this.restoreDefaults()
        })
    }

    updateRangeOutput(rangeInput) {
        const output = rangeInput.nextElementSibling
        const value = parseInt(rangeInput.value)
        const divisor = parseInt(rangeInput.dataset.divisor)
        const unit = output.dataset.unit
        
        if (divisor) {
            output.textContent = `${Math.round(value / divisor)} ${unit}`
        } else {
            output.textContent = `${value} ${unit}`
        }
    }

    switchPreferenceSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.navigation a').forEach(link => {
            link.classList.remove('active')
        })
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active')

        // Update sections
        document.querySelectorAll('.settings-section, .schedule-section, .theme-section, .about-section').forEach(section => {
            section.classList.remove('active')
            section.classList.add('hidden')
        })
        document.querySelector(`.${sectionName}-section`).classList.remove('hidden')
        document.querySelector(`.${sectionName}-section`).classList.add('active')
    }

    async minimizeToTray() {
        try {
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                await invoke('hide_window')
            }
        } catch (error) {
            console.error('Error minimizing to tray:', error)
        }
    }

    loadPreferenceValues() {
        // General settings
        document.getElementById('openAtLogin').checked = this.settings.openAtLogin
        document.getElementById('showIdeas').checked = this.settings.showIdeas
        document.getElementById('allScreens').checked = this.settings.allScreens
        document.getElementById('monitorIdleTime').checked = this.settings.monitorIdleTime
        document.getElementById('monitorDnd').checked = this.settings.monitorDnd
        document.getElementById('language').value = this.settings.language

        // Set fullscreen radio
        if (this.settings.fullscreen) {
            document.getElementById('fullscreen').checked = true
        } else {
            document.getElementById('window').checked = true
        }

        // Mini breaks
        document.getElementById('enableMiniBreaks').checked = this.settings.enableMiniBreaks
        document.getElementById('miniBreakFor').value = this.settings.microbreakDuration * 1000
        document.getElementById('miniBreakEvery').value = this.settings.microbreakInterval * 60000
        document.getElementById('showNotificationBeforeMiniBreak').checked = this.settings.showNotificationBeforeMiniBreak
        document.getElementById('enablePostponeMini').checked = this.settings.enablePostponeMini
        document.getElementById('enableStrictMini').checked = this.settings.enableStrictMini

        // Long breaks
        document.getElementById('enableLongBreaks').checked = this.settings.enableLongBreaks
        document.getElementById('longBreakFor').value = this.settings.breakDuration * 60000
        document.getElementById('longBreakEvery').value = this.settings.breakInterval
        document.getElementById('showNotificationBeforeLongBreak').checked = this.settings.showNotificationBeforeLongBreak
        document.getElementById('enablePostponeLong').checked = this.settings.enablePostponeLong
        document.getElementById('enableStrictLong').checked = this.settings.enableStrictLong

        // Theme
        document.querySelector(`input[name="mainColor"][value="${this.settings.mainColor}"]`).checked = true
        document.getElementById('enableTransparency').checked = this.settings.transparentMode
        document.getElementById('enableSounds').checked = this.settings.enableSounds
        document.querySelector(`input[name="audio"][value="${this.settings.audio}"]`).checked = true

        // Update range outputs
        this.updateRangeOutput(document.getElementById('miniBreakFor'))
        this.updateRangeOutput(document.getElementById('miniBreakEvery'))
        this.updateRangeOutput(document.getElementById('longBreakFor'))
        this.updateRangeOutput(document.getElementById('longBreakEvery'))

        // Apply theme
        this.applyTheme()
    }

    applyTheme() {
        const root = document.documentElement
        
        // Apply main color theme
        if (this.settings.mainColor) {
            root.style.setProperty('--main-color', this.settings.mainColor)
            
            // Update gradient background based on theme
            const color = this.settings.mainColor
            if (color === '#478484') {
                document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            } else if (color === '#633738') {
                document.body.style.background = 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)'
            } else if (color === '#ffffff') {
                document.body.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
            } else if (color === '#1D1F21') {
                document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            } else if (color === '#A49898') {
                document.body.style.background = 'linear-gradient(135deg, #8B7355 0%, #A0522D 100%)'
            } else if (color === '#567890') {
                document.body.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
            }
        }
        
        // Apply transparency
        if (this.settings.transparentMode) {
            document.body.style.backdropFilter = 'blur(10px)'
        } else {
            document.body.style.backdropFilter = 'none'
        }
    }

    restoreDefaults() {
        this.settings = {
            openAtLogin: false,
            fullscreen: false,
            showIdeas: true,
            allScreens: false,
            monitorIdleTime: false,
            monitorDnd: false,
            language: 'en',
            enableMiniBreaks: true,
            microbreakDuration: 20,
            microbreakInterval: 20,
            showNotificationBeforeMiniBreak: true,
            enablePostponeMini: true,
            enableStrictMini: false,
            enableLongBreaks: true,
            breakDuration: 5,
            breakInterval: 34,
            showNotificationBeforeLongBreak: true,
            enablePostponeLong: true,
            enableStrictLong: false,
            mainColor: '#478484',
            transparentMode: false,
            enableSounds: true,
            audio: 'crystal-glass',
            useMonochromeTrayIcon: false,
            checkNewVersion: true
        }
        
        this.loadPreferenceValues()
    }

    async savePreferences() {
        // Settings are already updated via event listeners
        await this.saveSettings()
        
        // Show success message
        this.showSaveSuccess()
        
        // Restart timer if running
        if (this.timer) {
            this.stopTimer()
            this.startBreaks()
        }
    }

    showSaveSuccess() {
        const saveBtn = document.getElementById('save-preferences-btn')
        const originalText = saveBtn.textContent
        saveBtn.textContent = 'Saved!'
        saveBtn.style.background = '#4CAF50'
        
        setTimeout(() => {
            saveBtn.textContent = originalText
            saveBtn.style.background = ''
        }, 2000)
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active')
        })
        
        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active')
    }

    startBreaks() {
        this.stopTimer()
        this.scheduleNextBreak()
        this.startTimer()
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
        if (this.breakTimer) {
            clearInterval(this.breakTimer)
            this.breakTimer = null
        }
    }

    scheduleNextBreak() {
        const now = new Date()
        
        if (!this.settings.enableMiniBreaks && !this.settings.enableLongBreaks) {
            return
        }
        
        let nextMicrobreak = null
        let nextBreak = null
        
        if (this.settings.enableMiniBreaks) {
            nextMicrobreak = new Date(now.getTime() + this.settings.microbreakInterval * 60 * 1000)
        }
        
        if (this.settings.enableLongBreaks) {
            nextBreak = new Date(now.getTime() + this.settings.breakInterval * 60 * 1000)
        }
        
        // Determine which break comes first
        if (nextMicrobreak && nextBreak) {
            if (nextMicrobreak < nextBreak) {
                this.currentBreak = { type: 'microbreak', time: nextMicrobreak }
            } else {
                this.currentBreak = { type: 'break', time: nextBreak }
            }
        } else if (nextMicrobreak) {
            this.currentBreak = { type: 'microbreak', time: nextMicrobreak }
        } else if (nextBreak) {
            this.currentBreak = { type: 'break', time: nextBreak }
        }
        
        this.nextBreakTime = this.currentBreak.time
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.updateTimer()
        }, 1000)
    }

    updateTimer() {
        if (!this.nextBreakTime) return

        const now = new Date()
        const timeRemaining = this.nextBreakTime.getTime() - now.getTime()

        if (timeRemaining <= 0) {
            this.startBreak()
        } else {
            const minutes = Math.floor(timeRemaining / 60000)
            const seconds = Math.floor((timeRemaining % 60000) / 1000)
            document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            
            const breakType = this.currentBreak.type === 'microbreak' ? 'Microbreak' : 'Break'
            document.getElementById('break-type').textContent = breakType
            document.getElementById('break-description').textContent = `Next ${breakType.toLowerCase()} in ${minutes}m ${seconds}s`
        }
    }

    startBreak() {
        this.stopTimer()
        this.showScreen('break')
        
        const duration = this.currentBreak.type === 'microbreak' 
            ? this.settings.microbreakDuration 
            : this.settings.breakDuration * 60
        
        document.getElementById('break-title').textContent = this.currentBreak.type === 'microbreak' ? 'Microbreak' : 'Break'
        document.getElementById('break-timer').textContent = this.formatTime(duration)
        
        // Load break idea
        if (this.settings.showIdeas) {
            this.loadBreakIdea()
        }
        
        // Start break timer
        let remainingTime = duration
        this.breakTimer = setInterval(() => {
            remainingTime--
            document.getElementById('break-timer').textContent = this.formatTime(remainingTime)
            
            if (remainingTime <= 0) {
                this.finishBreak()
            }
        }, 1000)
        
        // Show notification
        const notificationSetting = this.currentBreak.type === 'microbreak' 
            ? this.settings.showNotificationBeforeMiniBreak 
            : this.settings.showNotificationBeforeLongBreak
            
        if (notificationSetting) {
            this.showNotification(`${this.currentBreak.type === 'microbreak' ? 'Microbreak' : 'Break'} time!`)
        }
    }

    finishBreak() {
        this.stopTimer()
        this.scheduleNextBreak()
        this.startTimer()
        this.showScreen('main')
        
        if (this.settings.enableSounds) {
            this.playSound(this.settings.audio)
        }
    }

    skipBreak() {
        if ((this.currentBreak.type === 'microbreak' && this.settings.enableStrictMini) ||
            (this.currentBreak.type === 'break' && this.settings.enableStrictLong)) {
            return // Cannot skip in strict mode
        }
        
        this.stopTimer()
        this.scheduleNextBreak()
        this.startTimer()
        this.showScreen('main')
    }

    postponeBreak() {
        const postponeSetting = this.currentBreak.type === 'microbreak' 
            ? this.settings.enablePostponeMini 
            : this.settings.enablePostponeLong
            
        if (!postponeSetting) return
        
        if ((this.currentBreak.type === 'microbreak' && this.settings.enableStrictMini) ||
            (this.currentBreak.type === 'break' && this.settings.enableStrictLong)) {
            return // Cannot postpone in strict mode
        }
        
        // Postpone by 5 minutes
        this.nextBreakTime = new Date(this.nextBreakTime.getTime() + 5 * 60 * 1000)
        this.showScreen('main')
    }

    loadBreakIdea() {
        const microbreakIdeas = [
            {
                title: 'Quick Stretch',
                description: 'Stand up and stretch your arms above your head. Take a deep breath and hold for 5 seconds.'
            },
            {
                title: 'Eye Rest',
                description: 'Look away from your screen and focus on something 20 feet away for 20 seconds.'
            },
            {
                title: 'Neck Stretch',
                description: 'Gently tilt your head to each side, holding for 10 seconds each.'
            },
            {
                title: 'Shoulder Roll',
                description: 'Roll your shoulders forward and backward 5 times each.'
            }
        ]

        const breakIdeas = [
            {
                title: 'Walking Break',
                description: 'Take a short walk around your workspace or outside if possible.'
            },
            {
                title: 'Deep Breathing',
                description: 'Practice deep breathing: inhale for 4 counts, hold for 4, exhale for 4.'
            },
            {
                title: 'Stretching Routine',
                description: 'Do a series of stretches for your arms, legs, and back.'
            },
            {
                title: 'Mindful Moment',
                description: 'Close your eyes and take a moment to check in with how you\'re feeling.'
            }
        ]

        const ideas = this.currentBreak.type === 'microbreak' ? microbreakIdeas : breakIdeas
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)]
        
        document.getElementById('break-idea').innerHTML = `
            <h3>${randomIdea.title}</h3>
            <p>${randomIdea.description}</p>
        `
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    async showNotification(message) {
        if (this.settings.enableNotifications) {
            try {
                // Use browser notifications if available
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Stretchly', { body: message })
                } else if ('Notification' in window && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Stretchly', { body: message })
                        }
                    })
                }
            } catch (error) {
                console.error('Error showing notification:', error)
            }
        }
    }

    async playSound(soundName) {
        try {
            if (window.__TAURI__) {
                const { invoke } = await import('@tauri-apps/api/tauri')
                await invoke('play_sound', { soundName })
            }
        } catch (error) {
            console.error('Error playing sound:', error)
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StretchlyApp()
})
