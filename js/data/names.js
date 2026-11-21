/* Countries + name pools. Names are glued from lists + extras (initials, nicknames, titles, double-barrel)
   so the population of Hell stays varied. Skin/hair/eyes are NOT tied to country (on purpose). */
(function () {
  const C = (id, en, vi, m, f, last, order) => ({ id, en, vi, m, f, last, order: order || 'fl' });
  HC.data.countries = [
    C('vn', 'Vietnam', 'Việt Nam', ['Nam', 'Khoa', 'Phúc', 'Tuấn', 'Dũng', 'Quân'], ['Linh', 'Lan', 'Hương', 'Thảo', 'Vy', 'Mai'], ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'], 'lf'),
    C('us', 'USA', 'Mỹ', ['Chad', 'Brad', 'Tyler', 'Jake', 'Buck', 'Hank'], ['Karen', 'Becky', 'Tiffany', 'Madison', 'Kayla', 'Brenda'], ['Johnson', 'Miller', 'Walker', 'Cooper', 'Hayes', 'Brooks', 'Fisher', 'Lopez']),
    C('uk', 'United Kingdom', 'Anh', ['Reginald', 'Oliver', 'Alfie', 'Barnaby', 'Hugh', 'Nigel'], ['Beatrice', 'Poppy', 'Agatha', 'Edith', 'Penelope', 'Daisy'], ['Smythe', 'Whittaker', 'Pembroke', 'Fairweather', 'Hargreaves', 'Bottomley']),
    C('in', 'India', 'Ấn Độ', ['Rohan', 'Arjun', 'Vikram', 'Aarav', 'Raj', 'Kabir'], ['Priya', 'Ananya', 'Meera', 'Kavya', 'Isha', 'Diya'], ['Sharma', 'Patel', 'Iyer', 'Gupta', 'Reddy', 'Singh', 'Nair', 'Bose']),
    C('jp', 'Japan', 'Nhật Bản', ['Haruto', 'Kenji', 'Ren', 'Daichi', 'Takeshi', 'Yuto'], ['Sakura', 'Yuki', 'Hana', 'Mei', 'Aiko', 'Rin'], ['Tanaka', 'Sato', 'Watanabe', 'Kobayashi', 'Nakamura', 'Ito', 'Yamada'], 'lf'),
    C('kr', 'South Korea', 'Hàn Quốc', ['Minjun', 'Jihoon', 'Seojun', 'Hyunwoo', 'Dohyun', 'Taeyang'], ['Seoyeon', 'Jiwoo', 'Haeun', 'Yuna', 'Sooyoung', 'Minji'], ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Yoon'], 'lf'),
    C('cn', 'China', 'Trung Quốc', ['Wei', 'Jun', 'Hao', 'Lei', 'Chen', 'Bo'], ['Mei', 'Xiu', 'Fang', 'Jing', 'Lian', 'Yan'], ['Wang', 'Li', 'Zhang', 'Liu', 'Huang', 'Zhou', 'Wu'], 'lf'),
    C('br', 'Brazil', 'Brazil', ['Thiago', 'Rafael', 'Gustavo', 'Caio', 'Mateus', 'Bruno'], ['Camila', 'Beatriz', 'Larissa', 'Juliana', 'Fernanda', 'Luana'], ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Lima']),
    C('mx', 'Mexico', 'Mexico', ['Diego', 'Santiago', 'Emiliano', 'Jorge', 'Chuy', 'Beto'], ['Guadalupe', 'Ximena', 'Valentina', 'Paloma', 'Rocío', 'Itzel'], ['Hernández', 'García', 'Martínez', 'Ramírez', 'Torres', 'Flores', 'Morales']),
    C('ng', 'Nigeria', 'Nigeria', ['Chinedu', 'Emeka', 'Tunde', 'Kelechi', 'Ayo', 'Obinna'], ['Ngozi', 'Amara', 'Folake', 'Zainab', 'Chidera', 'Ife'], ['Okafor', 'Adeyemi', 'Balogun', 'Eze', 'Okonkwo', 'Abubakar']),
    C('ke', 'Kenya', 'Kenya', ['Kamau', 'Otieno', 'Baraka', 'Juma', 'Kiprop', 'Mwangi'], ['Wanjiru', 'Achieng', 'Nyambura', 'Zawadi', 'Akinyi', 'Neema'], ['Kariuki', 'Odhiambo', 'Njoroge', 'Kimani', 'Wekesa', 'Mutua']),
    C('eg', 'Egypt', 'Ai Cập', ['Omar', 'Khaled', 'Youssef', 'Mostafa', 'Tarek', 'Hossam'], ['Nour', 'Salma', 'Farida', 'Mariam', 'Layla', 'Hana'], ['Hassan', 'Mahmoud', 'Farouk', 'Saad', 'El-Sayed', 'Nasser']),
    C('tr', 'Turkey', 'Thổ Nhĩ Kỳ', ['Mehmet', 'Emre', 'Burak', 'Cem', 'Kaan', 'Yusuf'], ['Elif', 'Zeynep', 'Defne', 'Ece', 'Selin', 'Aylin'], ['Yilmaz', 'Demir', 'Çelik', 'Kaya', 'Aydin', 'Öztürk']),
    C('de', 'Germany', 'Đức', ['Lukas', 'Jürgen', 'Klaus', 'Dieter', 'Felix', 'Otto'], ['Greta', 'Hannelore', 'Ilse', 'Lena', 'Sabine', 'Heidi'], ['Müller', 'Schmidt', 'Weber', 'Fischer', 'Becker', 'Hoffmann', 'Koch']),
    C('fr', 'France', 'Pháp', ['Étienne', 'Jean-Luc', 'Mathieu', 'Gaspard', 'Rémy', 'Baptiste'], ['Amélie', 'Colette', 'Inès', 'Margaux', 'Odette', 'Chloé'], ['Dubois', 'Lefèvre', 'Moreau', 'Girard', 'Fontaine', 'Beaumont']),
    C('it', 'Italy', 'Ý', ['Luca', 'Marco', 'Giuseppe', 'Enzo', 'Matteo', 'Paolo'], ['Giulia', 'Chiara', 'Francesca', 'Lucia', 'Sofia', 'Gina'], ['Rossi', 'Bianchi', 'Esposito', 'Ferrari', 'Romano', 'Greco']),
    C('ru', 'Russia', 'Nga', ['Ivan', 'Dmitri', 'Boris', 'Sergei', 'Yuri', 'Vlad'], ['Natasha', 'Olga', 'Svetlana', 'Katya', 'Irina', 'Tanya'], ['Ivanov', 'Petrov', 'Volkov', 'Smirnov', 'Kuznetsov', 'Sokolov']),
    C('se', 'Sweden', 'Thụy Điển', ['Erik', 'Lars', 'Björn', 'Axel', 'Sven', 'Oskar'], ['Astrid', 'Freja', 'Ingrid', 'Maja', 'Linnea', 'Sigrid'], ['Andersson', 'Johansson', 'Lindqvist', 'Nilsson', 'Bergström', 'Ek']),
    C('ph', 'Philippines', 'Philippines', ['Jun-Jun', 'Miguel', 'Paolo', 'Rizal', 'Kuya', 'Jericho'], ['Maria', 'Angelica', 'Bea', 'Cecilia', 'Jasmine', 'Liza'], ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza']),
    C('id', 'Indonesia', 'Indonesia', ['Budi', 'Agus', 'Dewa', 'Rizky', 'Bayu', 'Wahyu'], ['Siti', 'Dewi', 'Putri', 'Ayu', 'Rina', 'Sri'], ['Santoso', 'Wijaya', 'Pratama', 'Saputra', 'Hidayat', 'Kusuma']),
    C('th', 'Thailand', 'Thái Lan', ['Somchai', 'Anan', 'Kritsada', 'Niran', 'Preecha', 'Chai'], ['Malee', 'Ploy', 'Siriporn', 'Nok', 'Dao', 'Pim'], ['Srisai', 'Wongsa', 'Chaiyo', 'Boonmee', 'Saetang', 'Rattana']),
    C('au', 'Australia', 'Úc', ['Bruce', 'Declan', 'Jarrah', 'Mick', 'Tane', 'Wazza'], ['Sheila', 'Kylie', 'Matilda', 'Shazza', 'Bindi', 'Tegan'], ['Thompson', 'Mitchell', 'Kelly', 'McKenzie', 'Nguyen', 'Walsh']),
    C('ca', 'Canada', 'Canada', ['Gordon', 'Liam', 'Jean-Marc', 'Declan', 'Mason', 'Ryley'], ['Emma', 'Chloé', 'Brooklyn', 'Maple', 'Josée', 'Avery'], ['Tremblay', 'MacDonald', 'Gagnon', 'Roy', 'Campbell', 'Bouchard']),
    C('pl', 'Poland', 'Ba Lan', ['Krzysztof', 'Tomasz', 'Piotr', 'Bartek', 'Jakub', 'Marek'], ['Agnieszka', 'Zofia', 'Kasia', 'Ewa', 'Magda', 'Basia'], ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kaminski', 'Zielinski']),
    // fictional places - because Hell takes everyone
    C('atl', 'Atlantis', 'Atlantis', ['Glub', 'Bubbles', 'Coral', 'Finn', 'Marlin', 'Kelp'], ['Pearl', 'Wavelyn', 'Shelly', 'Marina', 'Tidea', 'Nerida'], ['Seabottom', 'Dampfeet', 'Soggyton', 'Drownes', 'Underwater']),
    C('eld', 'El Dorado', 'El Dorado', ['Aurelio', 'Midas', 'Goldo', 'Oro', 'Dorian', 'Nuggeto'], ['Aurelia', 'Dorada', 'Pepita', 'Glitzia', 'Auri', 'Shinea'], ['Goldfeld', 'Richman', 'Doubloon', 'Sparklez', 'Bullion']),
    C('moon', 'The Moon', 'Mặt Trăng', ['Neil', 'Luna-Boy', 'Crater', 'Orbit', 'Apollo', 'Lunar'], ['Selene', 'Stella', 'Astra', 'Cosma', 'Luna', 'Nova'], ['Moonwalker', 'Cheeseman', 'Lowgravity', 'Craterface', 'Dustington'])
  ];
  const countryWeight = c => (c.id === 'atl' || c.id === 'eld' || c.id === 'moon') ? 0.35 : 1;
  HC.data.countryWeight = countryWeight;

  HC.data.nicknames = ['Lucky', 'Noodle', 'The Wall', 'Big', 'Tiny', 'Chief', 'Sunshine', 'Dr. Vibes', 'Pickle', 'Ace', 'Turbo', 'Mama', 'Wi-Fi', 'Coconut', 'Sleepy', 'Boss', 'Sparky', 'Meatball'];
  HC.data.titles = ['Dr.', 'Sir', 'Captain', 'Prof.', 'Lady', 'Chef', 'Uncle', 'Auntie', 'Count', 'Mx.'];
  HC.data.sillyNames = ['Bob Bobson', 'Karen Karenson', 'Nguyễn Văn Á', 'Sir Reginald Pigeon', 'xX_DarkLord_Xx', 'Test User 1', 'Dave', 'Another Dave', 'Linh Linh', 'John Smith (the 4th)', 'Mr. Nobody', 'Bao Bao', 'Pat Patterson', 'Kevin (not that Kevin)', 'Anonymous', 'Name Not Found', 'Gary', 'Steve from Accounting'];
  HC.data.middleInitials = 'ABCDEFGHJKLMNPRSTW'.split('');
})();
