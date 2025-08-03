class StretchlyApp {
    constructor() {
        this.settings = {
            microbreakDuration: 20,
            breakDuration: 5,
            microbreakInterval: 20,
            breakInterval: 34,
            enableNotifications: true,
            enableSounds: true,
            startOnBoot: false,
            pauseOnSuspend: true
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
        this.loadSystemInfo()
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
                
                document.getElementById('system-info').textContent = systemInfo
                document.getElementById('app-version').textContent = appVersion
            }
        } catch (error) {
            console.error('Error loading system info:', error)
            document.getElementById('system-info').textContent = 'System info unavailable'
        }
    }

    setupEventListeners() {
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
        document.getElementById('close-preferences-btn').addEventListener('click', () => {
            this.savePreferences()
            this.showScreen('main')
        })

        // Load preference values
        this.loadPreferenceValues()
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
        document.getElementById('microbreak-duration').value = this.settings.microbreakDuration
        document.getElementById('break-duration').value = this.settings.breakDuration
        document.getElementById('microbreak-interval').value = this.settings.microbreakInterval
        document.getElementById('break-interval').value = this.settings.breakInterval
        document.getElementById('enable-notifications').checked = this.settings.enableNotifications
        document.getElementById('enable-sounds').checked = this.settings.enableSounds
        document.getElementById('start-on-boot').checked = this.settings.startOnBoot
        document.getElementById('pause-on-suspend').checked = this.settings.pauseOnSuspend
    }

    async savePreferences() {
        this.settings.microbreakDuration = parseInt(document.getElementById('microbreak-duration').value)
        this.settings.breakDuration = parseInt(document.getElementById('break-duration').value)
        this.settings.microbreakInterval = parseInt(document.getElementById('microbreak-interval').value)
        this.settings.breakInterval = parseInt(document.getElementById('break-interval').value)
        this.settings.enableNotifications = document.getElementById('enable-notifications').checked
        this.settings.enableSounds = document.getElementById('enable-sounds').checked
        this.settings.startOnBoot = document.getElementById('start-on-boot').checked
        this.settings.pauseOnSuspend = document.getElementById('pause-on-suspend').checked

        await this.saveSettings()
        
        // Restart timer if running
        if (this.timer) {
            this.stopTimer()
            this.startBreaks()
        }
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
        const nextMicrobreak = new Date(now.getTime() + this.settings.microbreakInterval * 60 * 1000)
        const nextBreak = new Date(now.getTime() + this.settings.breakInterval * 60 * 1000)
        
        // Determine which break comes first
        if (nextMicrobreak < nextBreak) {
            this.currentBreak = { type: 'microbreak', time: nextMicrobreak }
        } else {
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
        this.loadBreakIdea()
        
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
        if (this.settings.enableNotifications) {
            this.showNotification(`${this.currentBreak.type === 'microbreak' ? 'Microbreak' : 'Break'} time!`)
        }
    }

    finishBreak() {
        this.stopTimer()
        this.scheduleNextBreak()
        this.startTimer()
        this.showScreen('main')
        
        if (this.settings.enableNotifications) {
            this.showNotification('Break completed!')
        }
    }

    skipBreak() {
        this.stopTimer()
        this.scheduleNextBreak()
        this.startTimer()
        this.showScreen('main')
    }

    postponeBreak() {
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StretchlyApp()
})
