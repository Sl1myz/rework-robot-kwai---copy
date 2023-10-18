// move 50/s = 25 cm
// 
// rotate 50/s = 180 deg
function turnBlueTerritory () {
    rotateLeft(90)
    move(15)
    rotateLeft(90)
}
function turnRedTerritory () {
    rotateRight(90)
    move(15)
    rotateRight(90)
}
function grabBall () {
    if (huskylens.readeBox(current_ball, Content1.xCenter) > 80 && huskylens.readeBox(current_ball, Content1.xCenter) < 160) {
        iBIT.Motor(ibitMotor.Forward, 30)
        basic.pause(400)
    } else if (huskylens.readeBox(current_ball, Content1.xCenter) > 160) {
        current_degree = Math.abs(current_degree - 45) % 360
        iBIT.Turn(ibitTurn.Left, 30)
        basic.pause(400)
    }
    iBIT.Servo(ibitServo.SV2, 90)
    basic.pause(500)
    iBIT.Motor(ibitMotor.Backward, 30)
    basic.pause(200)
    iBIT.MotorStop()
}
input.onButtonPressed(Button.A, function () {
    pause2 = 0
    iBIT.Servo(ibitServo.SV2, 0)
    iBIT.Servo(ibitServo.SV1, 0)
})
function identifyCurrentBallColor () {
    huskylens.request()
    if (huskylens.readeBox(current_ball, Content1.xCenter) > 100 && huskylens.readeBox(current_ball, Content1.xCenter) < 130) {
        if (huskylens.readeBox(current_ball, Content1.yCenter) > 130 && huskylens.readeBox(current_ball, Content1.yCenter) < 170) {
            return current_ball
        }
    }
    return 0
}
function KickBall () {
    iBIT.Servo(ibitServo.SV2, 0)
    iBIT.Motor(ibitMotor.Forward, 50)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV1, 120)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.MotorStop()
    basic.pause(500)
}
function getObject () {
    huskylens.request()
    if (huskylens.isAppear_s(HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        current_ball = huskylens.readBox_s(Content3.ID)
        if (huskylens.readeBox(current_ball, Content1.width) < 70 && huskylens.readeBox(current_ball, Content1.height) < 70) {
            if (current_ball == 1 || current_ball == 2) {
                if (huskylens.readeBox(current_ball, Content1.yCenter) > 80) {
                    iBIT.MotorStop()
                    iBIT.Servo(ibitServo.SV1, 0)
                    iBIT.Servo(ibitServo.SV2, 0)
                    basic.pause(200)
                    getCamLiveCOORD()
                    grabBall()
                    state = 1
                    basic.pause(100)
                }
            }
        } else {
            if (current_ball == 1) {
                turnBlueTerritory()
            } else if (current_ball == 2) {
                turnRedTerritory()
            }
        }
    }
}
function whereTFdoIthrowThisThing () {
    historical_degree = current_degree
    if (current_ball == 1) {
        rotateLeft((current_degree + 180) % 360)
    } else if (current_ball == 2) {
        rotateRight(current_degree)
    } else {
        rotateLeft((current_degree + 270) % 360)
    }
    basic.pause(500)
    KickBall()
    if (current_ball == 1) {
        rotateRight((historical_degree + 180) % 360)
    } else if (current_ball == 2) {
        rotateLeft(historical_degree)
    }
}
function getCamLiveCOORD () {
    if (huskylens.readeBox(current_ball, Content1.width) < 80 && huskylens.readeBox(current_ball, Content1.height) < 80) {
        cam_x = huskylens.readeBox(current_ball, Content1.xCenter)
        cam_y = huskylens.readeBox(current_ball, Content1.yCenter)
        huskylens.writeOSD("x:" + cam_x + " y:" + cam_y, cam_x, cam_y)
    }
}
input.onButtonPressed(Button.B, function () {
    pause2 = 1
    iBIT.Servo(ibitServo.SV2, 120)
    iBIT.Servo(ibitServo.SV1, 0)
})
function rotateLeft (degree: number) {
    iBIT.Spin(ibitSpin.Left, 50)
    basic.pause(degree * 1000 / 180)
    iBIT.MotorStop()
    current_degree = current_degree + degree
    current_degree = current_degree % 360
}
function gtfawayfromWall () {
    if (huskylens.isAppear(2, HUSKYLENSResultType_t.HUSKYLENSResultBlock) || huskylens.isAppear(3, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        if (huskylens.readeBox(2, Content1.width) > 160 && huskylens.readeBox(2, Content1.yCenter) < 80 || huskylens.readeBox(3, Content1.width) > 160 && huskylens.readeBox(3, Content1.yCenter) < 80) {
            rotateRight(120)
        }
    }
}
function move (unit: number) {
    iBIT.Motor(ibitMotor.Forward, 25)
    basic.pause(unit * 80)
    iBIT.MotorStop()
}
function rotateRight (degree: number) {
    iBIT.Spin(ibitSpin.Right, 50)
    basic.pause(degree * 1000 / 180)
    iBIT.MotorStop()
    current_degree = Math.abs(current_degree - degree)
    current_degree = current_degree % 360
}
let cam_y = 0
let cam_x = 0
let historical_degree = 0
let current_ball = 0
let state = 0
let current_degree = 0
let pause2 = 0
pause2 = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
iBIT.Servo(ibitServo.SV1, 0)
iBIT.Servo(ibitServo.SV2, 0)
basic.pause(1000)
current_degree = 0
state = 0
basic.forever(function () {
    huskylens.writeOSD("" + current_degree + "" + current_ball, 150, 30)
    if (pause2 == 0) {
        if (state == 0) {
            move(5)
            getObject()
        } else {
            whereTFdoIthrowThisThing()
            state = 0
        }
    }
})
