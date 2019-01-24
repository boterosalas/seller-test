
export class NavData {
    private Ip: string;

    constructor() {
        this.getNavIp().then(data => {
            this.setIp(data[0]);
        });

    }

    public getNavIp() {
        return new Promise((resolve, reject) => {
            const wind = window as any;
            const RTCPeerConnection = /*window.RTCPeerConnection ||*/ wind.webkitRTCPeerConnection || wind.mozRTCPeerConnection;

            if (RTCPeerConnection) {
                (() => {
                    const rtc = new RTCPeerConnection({ iceServers: [] });
                    if (1 || wind.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
                        rtc.createDataChannel('', { reliable: false });
                    }

                    rtc.onicecandidate = function (evt: any) {
                        // convert the candidate to SDP so we can run it through our general parser
                        // see https://twitter.com/lancestout/status/525796175425720320 for details
                        if (evt.candidate) {
                            grepSDP('a=' + evt.candidate.candidate);
                        }
                    };
                    rtc.createOffer(function (offerDesc: any) {
                        grepSDP(offerDesc.sdp);
                        rtc.setLocalDescription(offerDesc);
                    }, function (e: any) { console.warn('offer failed', e); });


                    const addrs = Object.create(null);
                    addrs['0.0.0.0'] = false;

                    function updateDisplay(newAddr: any) {
                        if (newAddr in addrs) {
                            return null;
                        } else { addrs[newAddr] = true; }
                        const displayAddrs = Object.keys(addrs).filter(function (k: any) { return addrs[k]; });
                        resolve(displayAddrs);
                    }

                    function grepSDP(sdp: any) {
                        const hosts = [];
                        sdp.split('\r\n').forEach(function (line: any) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                            if (line.indexOf('a=candidate') !== -1) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                                const parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                                    addr = parts[4],
                                    type = parts[7];
                                if (type === 'host') { updateDisplay(addr); }
                            }
                        });
                    }
                })();
            }
        });
    }

    public setIp(ip: string): void {
        this.Ip = ip;
    }

    public getIp(): string {
        return this.Ip;
    }
}
