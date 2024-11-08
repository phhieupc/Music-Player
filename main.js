const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
let randomSong = [];
const repeatSong = [];
const PLAYER_STORAGE_KEY = 'HIEU_PLAYER';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Em bên ai rồi',
            singer: 'Dương Hùng Sơn, Thành Đạt',
            path: '/music/EM BÊN AI RỒI - THÀNH ĐẠT FT DƯƠNG HÙNG SƠN - MV LYRIC.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/2/3/1/a/231a457028158358b95fef211b8907ae.jpg'
        },
        {
            name: 'Câu hứa chưa vẹn tròn',
            singer: 'Phát Huy T4',
            path: '/music/CÂU HỨA CHƯA VẸN TRÒN - PHÁT HUY T4 x HOÀNG GREEN -- OFFICIAL MUSIC VIDEO.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/7/7/a/d/77ad2f14ae137c80b05f2895d98cb88f.jpg'
        },
        {
            name: 'Có chi đâu mà buồn',
            singer: 'Phát Huy T4',
            path: '/music/CÓ CHI ĐÂU MÀ BUỒN - PHÁT HUY T4 -- OFFICIAL MV.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/7/9/1/3/7913e5233a41a9b115d56c13158bda20.jpg'
        },
        {
            name: 'Đời vô tư, người vô tâm',
            singer: 'Phát Huy T4',
            path: '/music/ĐỜI VÔ TƯ NGƯỜI VÔ TÂM - PHÁT HUY T4 -- Official Lyric Video.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/d/9/6/8/d9686e7d091db3bc5ebba75d74d908c7.jpg'
        },
        {
            name: 'Gió tầng nào gặp mây tầng ấy',
            singer: 'Thành Đạt',
            path: '/music/GIÓ TẦNG NÀO GẶP MÂY TẦNG ẤY - THÀNH ĐẠT x NGUYỄN HOÀNG PHONG ( OFFICIAL MV ).mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/8/3/e/a/83ea0261179ff815a944606607782a93.jpg'
        },
        {
            name: 'Hứa đợi nhưng chẳng tới',
            singer: 'Lâm Tuấn, Vương Thiên Tuấn',
            path: '/music/HỨA ĐỢI NHƯNG CHẲNG TỚI - LÂM TUẤN X VƯƠNG THIÊN TUẤN - MUSIC VIDEO OFFICIAL - Đúng là đời hứa sẽ ...mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/2/f/d/c/2fdc8a98b772106003b81b864d5a3568.jpg'
        },
        {
            name: 'Ôm nhiều mộng mơ',
            singer: 'Phát Huy T4',
            path: '/music/ÔM NHIỀU MỘNG MƠ - PHÁT HUY T4 x TLONG -- OFFICIAL MUSIC VIDEO.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/8/5/9/a/859a6069da9c126ca83817cf09c4f6e2.jpg'
        },
        {
            name: 'Phận duyên lỡ làng',
            singer: 'Phát Huy T4',
            path: '/music/PHẬN DUYÊN LỠ LÀNG - PHÁT HUY T4 X TRUZG - OFFICIAL MUSIC VIDEO.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/6/a/5/b/6a5ba60d63d591fe85bebd32c4410261.jpg'
        }

    ],
    setConfig: function (key, value) {
        app.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {

        // Khi ấn  nút Next
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Khi ấn  nút Prev
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // Khi ấn nút Random
        randomBtn.onclick = function () {
            if (app.isRandom) {
                app.isRandom = false;
                app.setConfig('isRandom', false);
                randomBtn.classList.remove('active');
            } else {
                app.isRandom = true;
                app.setConfig('isRandom', true);
                randomBtn.classList.add('active');
            }
        }

        // Khi ấn nút Repeat
        repeatBtn.onclick = function () {
            if (app.isRepeat) {
                app.isRepeat = false;
                app.setConfig('isRepeat', false);
                repeatBtn.classList.remove('active');
            } else {
                app.isRepeat = true;
                app.setConfig('isRepeat', true);
                repeatBtn.classList.add('active');
            }
        }

        // Khi audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to, thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý phát nhạc
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');

            cdThumbAnimate.play();
        }

        // Khi song được pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progress.style.background = `linear-gradient(to right, #ec1f55 ${progressPercent}%, #d3d3d3 ${progressPercent}%)`;
            }
        }

        // Xử lý khi tua 
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Xử lý khi click vào playlist
        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(.active)');
            if (songElement || e.target.closest('.option')) {
                if (songElement) {
                    app.currentIndex = Number(songElement.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function () {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        if (randomSong.length === app.songs.length) {
            randomSong = [];
        }
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
        }
        while (randomSong.includes(newIndex));
        app.currentIndex = newIndex;
        randomSong.push(newIndex);
        app.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            });
        }, 300)
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    start: function () {
        // Load the config
        this.loadConfig();

        //Lắng nghe, xử lý events
        this.handleEvents();

        //Định nghĩa thuộc tính cho object
        this.defineProperties();

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        //Tạo playlist
        this.render();

        //Hiển thị 
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();