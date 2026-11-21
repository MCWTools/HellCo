/* Hand-written story souls. They appear in the queue once `minGen` souls have been generated. */
HC.data.specials = [
  {
    id: 'hiss', minGen: 4, kind: 'human', name: 'Hiss McSnake', country: 'br', gender: 'm', age: 4,
    job: ['Recruiter (snake)', 'Chuyên viên tuyển dụng (rắn)'],
    death: ['Died of embarrassment after biting someone who died of fear. Considers it "a workplace accident".', 'Chết vì xấu hổ sau khi cắn một người rồi người đó chết vì sợ. Coi đó là "tai nạn nghề nghiệp".'],
    merits: [{ t: ['Always asks "are you okay?" after biting', 'Luôn hỏi "bạn ổn không?" sau khi cắn'], pts: 30 }, { t: ['Met every recruitment quota', 'Đạt mọi chỉ tiêu tuyển dụng'], pts: 28 }],
    sins: [{ t: ['Recruited a human by fear, not by contract', 'Tuyển người bằng cách doạ, không bằng hợp đồng'], pts: 30 }, { t: ['Hissed at the HR lady', 'Rít lên với chị HR'], pts: 26 }],
    look: { skinHex: 0x5faa3c, heightMul: 1.25, fat: 0.1, muscle: 0.2, hairStyle: 'bald', hat: 'none', eyeHex: 0xffcc00, extras: ['tongue'], topHex: 0x2a6b30 }
  },
  {
    id: 'exam', minGen: 9, kind: 'human', name: 'Rohan Verma', country: 'in', gender: 'm', age: 19,
    job: ['Student', 'Học sinh'],
    death: ['Fainted from shock on learning they would sit an exam as the only boy among 500 girls. Fainted 3 times. Still holding the pen.', 'Ngất vì sốc khi phát hiện mình phải thi giữa 500 nữ sinh và là nam duy nhất. Ngất 3 lần. Tay vẫn cầm bút.'],
    merits: [{ t: ['Wrote his name correctly. Neatly.', 'Viết đúng tên mình. Rất ngay ngắn.'], pts: 18 }, { t: ['Said "sorry" to the door he walked into', 'Xin lỗi cánh cửa mà mình đâm phải'], pts: 12 }],
    sins: [{ t: ['Borrowed a pencil. Did not return it.', 'Mượn một cây bút chì. Không trả.'], pts: 4 }],
    look: { fat: 0.15, muscle: 0.1, heightMul: 0.95, hairStyle: 'short', hairHex: 0x16110d, topHex: 0xe9e9e9, pattern: 'none', accessory: 'tie', skinHex: 0xb0763f, glasses: 1, eyeS: 1.4, smile: -0.8 }
  },
  {
    id: 'ant', minGen: 15, kind: 'ant', name: 'Antonio Antsworth', country: 'it', gender: 'm', age: 1,
    job: ['Security guard (ant)', 'Bảo vệ (kiến)'],
    death: ['Not dead. Applied for a job and the system accepted it.', 'Chưa chết. Nộp đơn xin việc và hệ thống đã chấp nhận.'],
    merits: [{ t: ['Caused a human to fall off a bike. Filed an apology.', 'Khiến một người ngã xe đạp. Đã nộp thư xin lỗi.'], pts: 25 }, { t: ['Carries 50x his weight in paperwork', 'Vác tài liệu nặng gấp 50 lần cơ thể'], pts: 30 }],
    sins: [{ t: ['Unauthorised tiny dancing at 3 AM', 'Nhảy múa tí hon trái phép lúc 3h sáng'], pts: 32 }, { t: ['Is an ant, in a human company', 'Là một con kiến trong công ty loài người'], pts: 24 }],
    look: {}
  },
  {
    id: 'gerald', minGen: 24, kind: 'human', name: 'Gerald Whitcombe', country: 'uk', gender: 'm', age: 41,
    job: ['Clerk (since 1923)', 'Thư ký (từ năm 1923)'],
    death: ['Died waiting for a promotion. The promotion is still pending.', 'Chết khi đang chờ thăng chức. Việc thăng chức vẫn đang chờ xử lý.'],
    merits: [{ t: ['Perfect attendance for 103 years', 'Đi làm đủ 103 năm không nghỉ ngày nào'], pts: 30 }, { t: ['Remembers every birthday in the office', 'Nhớ sinh nhật mọi người trong văn phòng'], pts: 20 }],
    sins: [{ t: ['Stole 1 stapler (1951)', 'Lấy trộm 1 cái dập ghim (1951)'], pts: 9 }],
    look: { skinHex: 0xe8d8c8, fat: 0.35, muscle: 0.05, heightMul: 0.95, hairStyle: 'bald', hatHex: 0x222222, hat: 'tophat', stache: true, hairHex: 0x888888, glasses: 1, topHex: 0x3a3a44, pattern: 'stripes', patHex: 0x55556a, accessory: 'bowtie' }
  },
  {
    id: 'burny', minGen: 34, kind: 'human', name: 'Burny McFlame', country: 'atl', gender: 'm', age: 666,
    job: ['Former CEO', 'Cựu CEO'],
    death: ['Fired himself "to test the fire alarms". They worked. Floor 5 did not.', 'Tự sa thải mình "để thử chuông báo cháy". Chuông chạy tốt. Tầng 5 thì không.'],
    merits: [{ t: ['Invented the open-plan inferno', 'Phát minh ra văn phòng mở kiểu lò lửa'], pts: 20 }],
    sins: [{ t: ['Burned down Floor 5 on purpose', 'Cố ý đốt cháy Tầng 5'], pts: 35 }, { t: ['Called the fire a "team-building exercise"', 'Gọi vụ cháy là "hoạt động team building"'], pts: 28 }, { t: ['Fearless in a fearful position', 'Không biết sợ ở vị trí cần biết sợ'], pts: 25 }],
    look: { skinHex: 0xc0392b, heightMul: 1.2, fat: 0.5, muscle: 0.8, hairStyle: 'spiky', hairHex: 0xff8a00, hat: 'crown', eyeHex: 0xff2200, smile: 0.9, teeth: true, topHex: 0x111111, pattern: 'none', extras: ['horns'] }
  }
];
