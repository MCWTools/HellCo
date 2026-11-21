/* Procedural merits/sins: templates x objects, appended to the hand-written ledger. [en, vi] pairs. */
(function () {
  function expand(tpls, target) {
    tpls.forEach(function (tp) {
      tp.o.forEach(function (o, i) {
        const p = tp.p[0] + Math.round((tp.p[1] - tp.p[0]) * (i / Math.max(1, tp.o.length - 1)));
        target.push({ t: [tp.e.replace('{o}', o[0]), tp.v.replace('{o}', o[1])], pts: p });
      });
    });
  }
  expand([
    { e: 'Helped {o} cross the road', v: 'Giúp {o} qua đường', p: [6, 10], o: [['a grandma', 'một bà cụ'], ['an old man', 'một ông cụ'], ['a goose', 'một con ngỗng'], ['a toddler', 'một em bé'], ['a blind man', 'một người khiếm thị']] },
    { e: 'Returned a lost {o}', v: 'Trả lại {o} bị rơi', p: [7, 15], o: [['umbrella', 'cái dù'], ['phone', 'cái điện thoại'], ['wallet full of cash', 'cái ví đầy tiền'], ['passport', 'cuốn hộ chiếu'], ['dog', 'con chó']] },
    { e: 'Shared {o} with a stranger', v: 'Chia {o} cho người lạ', p: [5, 12], o: [['their lunch', 'bữa trưa'], ['a charger', 'cục sạc'], ['the last slice of pizza', 'miếng pizza cuối'], ['their umbrella', 'cây dù'], ['their blanket in winter', 'cái chăn lúc trời lạnh']] },
    { e: 'Donated {o} to charity', v: 'Quyên góp {o} cho từ thiện', p: [8, 18], o: [['old clothes', 'quần áo cũ'], ['500 books', '500 cuốn sách'], ['a month of salary', 'lương một tháng'], ['a tractor', 'một chiếc máy cày'], ['a whole bakery', 'cả tiệm bánh']] },
    { e: 'Taught {o} for free', v: 'Dạy miễn phí cho {o}', p: [7, 16], o: [['a lost tourist', 'một du khách lạc đường'], ['the neighbourhood kids', 'tụi nhỏ trong xóm'], ['an entire village', 'cả một ngôi làng'], ['their rival', 'đối thủ của mình'], ['a nervous exam student', 'một thí sinh run rẩy']] },
    { e: 'Visited {o} every week', v: 'Tuần nào cũng ghé thăm {o}', p: [6, 14], o: [['a lonely neighbour', 'bác hàng xóm cô đơn'], ['the nursing home', 'viện dưỡng lão'], ['a sick friend', 'người bạn đang ốm'], ['the animal shelter', 'trại cứu hộ'], ['an orphanage', 'cô nhi viện']] }
  ], HC.data.merits);
  expand([
    { e: 'Ate {o} that was not theirs', v: 'Ăn {o} không phải của mình', p: [4, 9], o: [['a labelled lunch', 'hộp cơm có dán tên'], ['the office cake', 'bánh của văn phòng'], ['a neighbour\'s mango', 'xoài của hàng xóm'], ['the last dumpling', 'cái bánh bao cuối'], ['a birthday cake, early', 'bánh sinh nhật, ăn trước']] },
    { e: 'Spoiled the ending of {o}', v: 'Spoil kết thúc của {o}', p: [5, 11], o: [['a movie', 'một bộ phim'], ['a series', 'một bộ phim bộ'], ['a novel', 'một cuốn tiểu thuyết'], ['a football match', 'một trận bóng'], ['a wedding surprise', 'một màn cầu hôn bất ngờ']] },
    { e: 'Stole {o}', v: 'Ăn trộm {o}', p: [10, 28], o: [['a parking spot', 'chỗ đậu xe'], ['a bicycle', 'một chiếc xe đạp'], ['a bag of chips', 'một gói snack'], ['a taxi, from a pregnant woman', 'cái taxi của bà bầu'], ['someone\'s idea at a meeting', 'ý tưởng của đồng nghiệp trong buổi họp'], ['a charity collection box', 'thùng từ thiện']] },
    { e: 'Lied about {o}', v: 'Nói dối về {o}', p: [6, 20], o: [['being sick', 'chuyện bị ốm'], ['their age', 'tuổi của mình'], ['their CV', 'bản CV'], ['where the money went', 'tiền đã đi đâu'], ['a very important meeting', 'một cuộc họp quan trọng']] },
    { e: 'Scammed {o}', v: 'Lừa đảo {o}', p: [25, 45], o: [['tourists', 'khách du lịch'], ['grandmas', 'các bà cụ'], ['investors', 'nhà đầu tư'], ['an entire village', 'cả một ngôi làng'], ['their own family', 'chính gia đình mình']] },
    { e: 'Betrayed {o}', v: 'Phản bội {o}', p: [20, 45], o: [['a best friend', 'bạn thân'], ['their business partner', 'đối tác làm ăn'], ['their own twin', 'chính anh em sinh đôi'], ['a whole team', 'cả đội'], ['their country', 'đất nước mình']] },
    { e: 'Set fire to {o}', v: 'Đốt {o}', p: [30, 60], o: [['a trash bin', 'thùng rác'], ['a rival\'s shop', 'tiệm của đối thủ'], ['a bridge', 'một cây cầu'], ['a school, "by accident"', 'một ngôi trường "vô tình"'], ['a forest', 'một cánh rừng']] }
  ], HC.data.sins);
})();
