/* Lore fragments unlock by rank or by judging a special soul. Collect them in the Codex. */
HC.data.lore = [
  { id: 'door', rank: 1, t: ['The CEO door has not opened in 2,000 years. Boss Diêm still polishes it every morning.', 'Cánh cửa phòng CEO đã không mở suốt 2.000 năm. Sếp Diêm vẫn lau nó mỗi sáng.'] },
  { id: 'acting', rank: 2, t: ['Boss Diêm\'s desk sign says "ACTING CEO". The word ACTING is written in pencil.', 'Bảng tên trên bàn sếp Diêm ghi "CEO TẠM QUYỀN". Hai chữ TẠM QUYỀN viết bằng bút chì.'] },
  { id: 'fear', rank: 3, t: ['The Hell Corp contract says the CEO must be "the most frightened soul on record". Fearless CEOs keep burning things down.', 'Hợp đồng Hell Corp quy định CEO phải là "linh hồn nhát nhất từng được ghi nhận". CEO không biết sợ cứ thích đốt phá.'] },
  { id: 'screening', rank: 4, t: ['Every year, 17,000 souls are screened for the Fear Score. Most fail. Some faint during the test.', 'Mỗi năm có 17.000 linh hồn được sàng lọc điểm Sợ. Đa số trượt. Một số ngất ngay trong lúc làm bài.'] },
  { id: 'you', rank: 5, t: ['Your death was "arranged". You scored 100% on Fear. The snake just delivered the invitation.', 'Cái chết của bạn đã được "sắp xếp". Bạn đạt 100% điểm Sợ. Con rắn chỉ là người đưa thư mời.'] },
  { id: 'snake', special: 'hiss', t: ['Hiss McSnake is a Recruiter. His bite is not venomous. His job is to scare, and he is very good at it.', 'Hiss McSnake là chuyên viên tuyển dụng. Vết cắn của anh ta không độc. Việc của anh ta là doạ, và anh ta làm rất giỏi.'] },
  { id: 'exam', special: 'exam', t: ['Rohan was a backup candidate. He fainted in the exam hall, but his Fear Score was 99.8%.', 'Rohan là ứng viên dự phòng. Cậu ấy ngất trong phòng thi nhưng điểm Sợ lên tới 99,8%.'] },
  { id: 'ant', special: 'ant', t: ['The ant is the only employee Boss Diêm is afraid of. Nobody knows why.', 'Con kiến là nhân viên duy nhất mà sếp Diêm sợ. Không ai biết vì sao.'] },
  { id: 'gerald', special: 'gerald', t: ['Gerald\'s promotion stamp has been in the CEO\'s office since 1923. Nobody has dared to go in.', 'Con dấu thăng chức của Gerald nằm trong phòng CEO từ năm 1923. Chưa ai dám vào lấy.'] },
  { id: 'burny', special: 'burny', t: ['The last CEO was fearless, so the contract was written to prevent it from happening again. Hence you.', 'CEO đời trước không biết sợ nên hợp đồng được viết lại để không bao giờ xảy ra nữa. Vì thế mới có bạn.'] }
];
HC.data.ranks = [
  { en: 'Intern', vi: 'Thực tập sinh', kpi: 0, salary: 20 },
  { en: 'Staff', vi: 'Nhân viên', kpi: 120, salary: 35 },
  { en: 'Team Lead', vi: 'Trưởng nhóm', kpi: 320, salary: 55 },
  { en: 'Manager', vi: 'Trưởng phòng', kpi: 650, salary: 80 },
  { en: 'Director', vi: 'Giám đốc', kpi: 1100, salary: 110 },
  { en: 'Vice President', vi: 'Phó chủ tịch', kpi: 1700, salary: 150 },
  { en: 'CEO', vi: 'CEO', kpi: 2600, salary: 220 }
];
HC.data.events = ['normal', 'normal', 'normal', 'double', 'audit', 'coffee', 'vip'];
