/* Death grammar. Many FAMILIES of sentence shapes; each family has templates with slots.
   Slot lists are [en, vi] pairs. A death is stored as a tiny spec {f,t,p:[...],n,note}
   and rendered in whichever language is active. */
(function () {
  const L = {}; // slot lexicons

  L.cause = [
    ['forgetting to breathe', 'quên thở'], ['eating spicy noodles too fast', 'ăn mì cay quá nhanh'], ['reading the comment section', 'đọc phần bình luận'],
    ['a phone at 1% battery', 'điện thoại còn 1% pin'], ['laughing at their own joke', 'cười chính câu đùa của mình'], ['sneezing 47 times in a row', 'hắt xì 47 cái liên tiếp'],
    ['a very aggressive pigeon', 'một con bồ câu cực kỳ hung hăng'], ['waiting for Wi-Fi that never connected', 'chờ Wi-Fi không bao giờ kết nối'], ['stepping on a LEGO, then the stairs', 'đạp trúng LEGO rồi ngã cầu thang'],
    ['a surprise group hug', 'cái ôm tập thể bất ngờ'], ['too many open tabs', 'mở quá nhiều tab'], ['a spoiler', 'bị spoil phim'],
    ['a "seen" message with no reply', 'tin nhắn "đã xem" không trả lời'], ['a coconut. Just a coconut.', 'một quả dừa. Chỉ một quả dừa.'], ['a childproof bottle cap', 'nắp chai chống trẻ em'],
    ['a handshake that lasted too long', 'cái bắt tay kéo dài quá lâu'], ['slipping on their own banana peel', 'trượt vỏ chuối của chính mình'], ['swallowing a fly mid-sentence', 'nuốt con ruồi giữa câu nói'],
    ['a chair that was not a chair', 'một cái ghế không phải là ghế'], ['hiccups (the long kind)', 'nấc cụt (loại rất dài)'], ['an unskippable ad', 'quảng cáo không skip được'],
    ['a sock that would not match', 'chiếc tất không tìm được đôi'], ['an escalator that stopped, emotionally', 'cái thang cuốn dừng lại, về mặt cảm xúc'], ['a very confident goose', 'một con ngỗng cực kỳ tự tin'],
    ['pressing "update later" 900 times', 'bấm "cập nhật sau" 900 lần'], ['a cough that got ideas', 'một cơn ho có tham vọng']
  ];
  L.scary = [
    ['a non-venomous snake', 'con rắn không độc'], ['a moth', 'con bướm đêm'], ['a toddler shouting "boo"', 'đứa bé hét "ú oà"'], ['their own reflection in the dark', 'hình phản chiếu của chính mình trong bóng tối'],
    ['a rubber duck', 'con vịt cao su'], ['a balloon popping', 'tiếng bóng bay nổ'], ['a spider the size of a raisin', 'con nhện bé bằng hạt nho khô'], ['a surprise birthday party', 'bữa tiệc sinh nhật bất ngờ'],
    ['a very polite ghost', 'một con ma cực kỳ lịch sự'], ['a gecko on the ceiling', 'con thạch sùng trên trần nhà']
  ];
  L.embar = [
    ['tripping in front of their crush', 'vấp ngã trước mặt crush'], ['calling the teacher "mom"', 'gọi cô giáo là "mẹ"'], ['waving at someone who was not waving at them', 'vẫy tay chào người ta không chào mình'],
    ['a microphone that was still on', 'cái mic vẫn đang bật'], ['sending a text to the wrong group chat', 'gửi nhầm tin nhắn vào nhóm chat'], ['pushing a door marked "pull"', 'đẩy cánh cửa ghi "kéo"'],
    ['saying "you too" when the waiter said enjoy your meal', 'nói "bạn cũng vậy" khi nhân viên chúc ngon miệng'], ['humming a song loudly in a silent elevator', 'ngân nga to trong thang máy im lặng']
  ];
  L.effect = [
    ['their heart simply gave up', 'trái tim tự bỏ cuộc'], ['they fainted and never woke up', 'ngất đi và không bao giờ tỉnh lại'], ['they ran backwards off a cliff', 'chạy lùi rớt xuống vực'],
    ['they forgot how to stand', 'quên mất cách đứng'], ['their soul left before their body did', 'linh hồn rời đi trước cả cơ thể'], ['they turned around so fast they became a spiral', 'quay người nhanh đến mức thành hình xoắn ốc'],
    ['they screamed once, politely, and expired', 'họ hét một tiếng, lịch sự, rồi tắt thở']
  ];
  L.activity = [
    ['Was taking an exam', 'Đang làm bài thi'], ['Was cycling to work', 'Đang đạp xe đi làm'], ['Was cooking dinner', 'Đang nấu bữa tối'], ['Was livestreaming', 'Đang livestream'],
    ['Was walking the dog', 'Đang dắt chó đi dạo'], ['Was on a first date', 'Đang hẹn hò lần đầu'], ['Was giving a speech', 'Đang phát biểu'], ['Was at a family reunion', 'Đang ở buổi họp mặt gia đình'],
    ['Was shopping for socks', 'Đang đi mua tất'], ['Was playing hide and seek', 'Đang chơi trốn tìm'], ['Was queueing for bubble tea', 'Đang xếp hàng mua trà sữa'], ['Was in a job interview', 'Đang phỏng vấn xin việc']
  ];
  L.discover = [
    ['they realized they were wearing two different shoes', 'nhận ra mình mang hai chiếc giày khác nhau'], ['their full name was called out loud', 'bị gọi to cả họ tên'], ['everyone was staring at them', 'ai cũng đang nhìn mình'],
    ['they spotted their ex', 'thấy người yêu cũ'], ['the mute button had been off the whole time', 'nút tắt mic chưa bao giờ được bật'], ['they remembered leaving the stove on in 2009', 'nhớ ra đã quên tắt bếp từ năm 2009'],
    ['a stranger said "long time no see"', 'một người lạ nói "lâu quá không gặp"'], ['an ant looked at them funny', 'con kiến nhìn mình hơi lạ'], ['they were the only person not in costume', 'chỉ mình họ không mặc đồ hoá trang'],
    ['the room was much bigger than expected', 'căn phòng to hơn tưởng tượng rất nhiều']
  ];
  L.after = [
    ['Fainted 3 times.', 'Ngất 3 lần.'], ['Never recovered. Still holding the pen.', 'Không hồi phục. Tay vẫn cầm bút.'], ['Left the scene at high speed, upwards.', 'Rời hiện trường với tốc độ cao, hướng lên trên.'],
    ['The audience clapped anyway.', 'Khán giả vẫn vỗ tay.'], ['Bystanders filmed it. 4M views.', 'Người qua đường quay lại. 4 triệu view.'], ['Cause: shock. Also: vibes.', 'Nguyên nhân: sốc. Và cả năng lượng xấu.'],
    ['Died laughing. At nothing.', 'Chết vì cười. Không rõ cười gì.'], ['Paramedics arrived. Also fainted.', 'Nhân viên cấp cứu đến. Cũng ngất luôn.']
  ];
  L.repeat = [
    ['the same chair', 'cùng một cái ghế'], ['a different pigeon', 'một con bồ câu khác'], ['a staircase that was not there before', 'một cầu thang không hề có trước đó'], ['"just checking my phone"', '"chỉ xem điện thoại tí thôi"'],
    ['a banana peel, maybe the same one', 'một vỏ chuối, có thể là cùng một cái'], ['somebody saying "relax"', 'ai đó nói "bình tĩnh đi"']
  ];
  L.others = [
    ['called by their full name by their mother', 'bị mẹ gọi cả họ tên'], ['spoiled the ending by their best friend', 'bị bạn thân spoil kết phim'], ['ghosted by a vending machine', 'bị máy bán hàng tự động bơ'],
    ['left on read by the universe', 'bị vũ trụ để "đã xem"'], ['hugged too hard by a relative', 'bị họ hàng ôm quá chặt'], ['asked "so when are you getting married?" 11 times', 'bị hỏi "bao giờ cưới?" 11 lần'],
    ['told "we need to talk" and nothing else', 'bị nhắn "mình cần nói chuyện" rồi im luôn'], ['introduced to a stranger as "the funny one"', 'bị giới thiệu là "người hài hước" trước người lạ']
  ];
  L.hero = [
    ['save a cat', 'cứu một con mèo'], ['rescue a balloon', 'cứu một quả bóng bay'], ['stop a fight between two pigeons', 'can hai con bồ câu đánh nhau'], ['return a lost wallet', 'trả lại cái ví bị rơi'],
    ['catch a falling umbrella', 'đỡ một cái ô đang rơi'], ['pet a very scary dog, politely', 'xoa đầu con chó rất dữ, một cách lịch sự']
  ];
  L.twist = [
    ['it turned out nobody needed saving', 'hoá ra không ai cần được cứu'], ['it was a prank. They were the prank.', 'hoá ra là trò đùa. Họ là trò đùa.'], ['the rescued thing was fine; the rescuer was not', 'thứ được cứu vẫn ổn; người đi cứu thì không'],
    ['they were saving the wrong thing entirely', 'họ cứu nhầm thứ hoàn toàn'], ['the thing waved back, and then the rescuer fell', 'nó vẫy tay lại, rồi người cứu té']
  ];
  L.theory = [
    ['it was the pigeon', 'là con bồ câu'], ['it was Mercury in retrograde', 'là do sao Thuỷ nghịch hành'], ['it was the soup', 'là do món súp'], ['they simply forgot the rules of physics', 'họ quên mất các định luật vật lý'],
    ['an ant had a plan', 'một con kiến có kế hoạch'], ['it was Tuesday', 'hôm đó là thứ Ba'], ['the floor was lava (briefly)', 'sàn nhà là dung nham (một lúc)'], ['they sat on the wrong chair', 'họ ngồi nhầm ghế']
  ];
  L.fixed = [ // hand-written classics (some only for a given appearance gender: 'm'/'f')
    { t: ['Fainted from shock on learning they would sit an exam as the only boy among 500 girls. Fainted 3 times. Still holding the pen.', 'Ngất vì sốc khi phát hiện mình phải thi giữa 500 nữ sinh và là nam duy nhất. Ngất 3 lần. Tay vẫn cầm bút.'], g: 'm' },
    { t: ['Died of fear after being bitten by a non-venomous snake. The snake is also in therapy.', 'Chết vì sợ sau khi bị một con rắn không độc cắn. Con rắn cũng đang điều trị tâm lý.'] },
    { t: ['Tripped over an ant while cycling and flew headfirst. The ant is fine and has applied for a job.', 'Vấp phải một con kiến khi đạp xe và lao đầu xuống đất. Con kiến vẫn ổn và đã nộp đơn xin việc.'] },
    { t: ['Choked on a single grape at a "healthy snack" meeting.', 'Nghẹn một quả nho trong buổi họp "ăn nhẹ lành mạnh".'] },
    { t: ['Yelled "I am fine!" and was, until the third sentence.', 'Hét lên "tôi ổn!" và đúng là ổn, cho đến câu thứ ba.'] },
    { t: ['Sat on the remote. The remote won.', 'Ngồi lên cái điều khiển. Cái điều khiển thắng.'] },
    { t: ['Died while checking if the stove was off. It was off. The checking was not.', 'Chết khi đang kiểm tra bếp đã tắt chưa. Bếp đã tắt. Việc kiểm tra thì chưa.'] }
  ];
  L.notePre = [['Coroner', 'Pháp y'], ['Witness', 'Nhân chứng'], ['Police report', 'Biên bản công an'], ['Insurance', 'Bảo hiểm'], ['Animal involved', 'Động vật liên quan'], ['Family statement', 'Lời gia đình']];
  L.note = [
    ['The ant has filed a complaint.', 'Con kiến đã nộp đơn khiếu nại.'], ['Not a crime. Only embarrassing.', 'Không phải tội phạm. Chỉ là xấu hổ.'], ['Reviews: 1 star. "Would not die again."', 'Đánh giá: 1 sao. "Sẽ không chết lần nữa."'],
    ['Case closed. Nobody wanted to open it.', 'Hồ sơ đã đóng. Chẳng ai muốn mở.'], ['"I saw nothing, but I saw it loudly."', '"Tôi không thấy gì, nhưng thấy rất to."'], ['Claim denied: "obviously avoidable".', 'Từ chối bồi thường: "rõ ràng tránh được".'],
    ['The pigeon declined to comment.', 'Con bồ câu từ chối bình luận.'], ['"He was always like this." (He was not.)', '"Nó vẫn luôn như vậy." (Không hề.)'], ['Time of death: just after "watch this".', 'Thời điểm chết: ngay sau câu "xem này".'],
    ['Filed under: Why.', 'Phân loại: Tại sao.'], ['The deceased looked surprised. Everyone was.', 'Người chết trông ngạc nhiên. Ai cũng vậy.'], ['Autopsy inconclusive. Autopsy also confused.', 'Giải phẫu không kết luận. Giải phẫu cũng bối rối.'],
    ['The soup was not involved. We checked twice.', 'Món súp không liên quan. Chúng tôi kiểm tra hai lần.'], ['Cause is disputed by 3 aunts.', 'Nguyên nhân bị 3 bà cô phản đối.'], ['Last words: "how bad could it be".', 'Lời cuối: "tệ được tới đâu chứ".'],
    ['Soundtrack at the scene: a trombone.', 'Nhạc nền hiện trường: một cây kèn trombone.'], ['The family is "not even surprised".', 'Gia đình nói "không hề bất ngờ".'], ['A small crowd applauded, then left.', 'Một đám đông nhỏ vỗ tay rồi bỏ đi.']
  ];

  // Families: w = weight. Templates use {0},{1},{2} for slot picks, {n} for a number. cond: appearance gender.
  const F = [
    { id: 'short', w: 3, tpl: [
      { s: ['cause'], en: 'Died of {0}.', vi: 'Chết vì {0}.' },
      { s: ['cause'], en: 'Cause of death: {0}.', vi: 'Nguyên nhân tử vong: {0}.' },
      { s: ['cause'], en: 'Allegedly: {0}.', vi: 'Theo lời đồn: {0}.' }] },
    { id: 'effect', w: 3, tpl: [
      { s: ['scary', 'effect'], en: 'Was so scared of {0} that {1}.', vi: 'Sợ {0} đến mức {1}.' },
      { s: ['embar', 'effect'], en: 'Was so embarrassed by {0} that {1}.', vi: 'Quá xấu hổ vì {0} nên {1}.' },
      { s: ['scary', 'effect'], en: 'Saw {0}. Then {1}.', vi: 'Nhìn thấy {0}. Rồi {1}.' }] },
    { id: 'story', w: 3, tpl: [
      { s: ['activity', 'discover', 'after'], en: '{0} when {1}. {2}', vi: '{0} thì {1}. {2}' },
      { s: ['activity', 'discover', 'after'], en: '{0}. Then {1}. {2}', vi: '{0}. Rồi {1}. {2}' }] },
    { id: 'job', w: 2, tpl: [{ s: [], job: true, en: '{J}', vi: '{J}' }] },
    { id: 'repeat', w: 1, tpl: [
      { s: ['repeat'], num: [2, 9], en: 'Died {n} times. Every time: {0}.', vi: 'Chết {n} lần. Lần nào cũng vì {0}.' }] },
    { id: 'others', w: 2, tpl: [
      { s: ['others'], en: 'Died after being {0}.', vi: 'Chết sau khi {0}.' },
      { s: ['others'], en: 'Cause: being {0}.', vi: 'Nguyên nhân: {0}.' }] },
    { id: 'hero', w: 1, tpl: [{ s: ['hero', 'twist'], en: 'Tried to {0}, but {1}.', vi: 'Cố {0}, nhưng {1}.' }] },
    { id: 'disputed', w: 1, tpl: [{ s: ['theory', 'theory', 'theory'], uniq: true, en: 'Undetermined. Three theories: {0}; {1}; {2}. All dumb.', vi: 'Chưa xác định. Ba giả thuyết: {0}; {1}; {2}. Cái nào cũng ngớ ngẩn.' }] },
    { id: 'classic', w: 2, tpl: [{ s: [], fixed: true, en: '{X}', vi: '{X}' }] }
  ];

  HC.data.deathLex = L;
  HC.data.deathFamilies = F;
})();
