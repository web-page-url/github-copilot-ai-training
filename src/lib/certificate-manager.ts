// Certificate Manager - Handles permanent certificate eligibility
export class CertificateManager {
  private static readonly MASTER_CERT_KEY = 'master_certificate_earned';
  private static readonly USER_CERTS_KEY = 'user_certificates';

  /**
   * Check if user has permanently earned master certificate
   */
  static hasMasterCertificate(userId: string): boolean {
    try {
      const earnedCerts = localStorage.getItem(this.MASTER_CERT_KEY);
      if (earnedCerts) {
        const certList = JSON.parse(earnedCerts) as string[];
        return certList.includes(userId);
      }
      return false;
    } catch (error) {
      console.error('Error checking master certificate status:', error);
      return false;
    }
  }

  /**
   * Mark user as having earned master certificate permanently
   */
  static awardMasterCertificate(userId: string): void {
    try {
      const earnedCerts = localStorage.getItem(this.MASTER_CERT_KEY);
      let certList: string[] = [];
      
      if (earnedCerts) {
        certList = JSON.parse(earnedCerts) as string[];
      }
      
      if (!certList.includes(userId)) {
        certList.push(userId);
        localStorage.setItem(this.MASTER_CERT_KEY, JSON.stringify(certList));
        
        // Also store individual user certificate data
        const userCerts = this.getUserCertificates(userId);
        userCerts.masterCertificate = {
          earnedAt: new Date().toISOString(),
          userId: userId,
          isPermanent: true
        };
        
        localStorage.setItem(`${this.USER_CERTS_KEY}_${userId}`, JSON.stringify(userCerts));
        
        console.log(`🏆 Master certificate permanently awarded to user: ${userId}`);
      }
    } catch (error) {
      console.error('Error awarding master certificate:', error);
    }
  }

  /**
   * Get all certificates for a specific user
   */
  static getUserCertificates(userId: string): UserCertificates {
    try {
      const userCerts = localStorage.getItem(`${this.USER_CERTS_KEY}_${userId}`);
      if (userCerts) {
        return JSON.parse(userCerts) as UserCertificates;
      }
      
      return {
        userId: userId,
        sectionCertificates: [],
        masterCertificate: null
      };
    } catch (error) {
      console.error('Error getting user certificates:', error);
      return {
        userId: userId,
        sectionCertificates: [],
        masterCertificate: null
      };
    }
  }

  /**
   * Award section certificate to user
   */
  static awardSectionCertificate(userId: string, sectionNumber: number, completionData: SectionCompletionData): void {
    try {
      const userCerts = this.getUserCertificates(userId);
      
      // Check if section certificate already exists
      const existingIndex = userCerts.sectionCertificates.findIndex(cert => cert.sectionNumber === sectionNumber);
      
      const sectionCert: SectionCertificate = {
        sectionNumber,
        earnedAt: new Date().toISOString(),
        completionData,
        isPermanent: true
      };
      
      if (existingIndex >= 0) {
        // Update existing certificate
        userCerts.sectionCertificates[existingIndex] = sectionCert;
      } else {
        // Add new certificate
        userCerts.sectionCertificates.push(sectionCert);
      }
      
      localStorage.setItem(`${this.USER_CERTS_KEY}_${userId}`, JSON.stringify(userCerts));
      
      console.log(`📄 Section ${sectionNumber} certificate awarded to user: ${userId}`);
    } catch (error) {
      console.error('Error awarding section certificate:', error);
    }
  }

  /**
   * Check completion status and auto-award master certificate if eligible
   */
  static checkAndAwardMasterCertificate(userId: string, completedSections: number, overallAccuracy: number): boolean {
    if (completedSections >= 6 && overallAccuracy >= 60 && !this.hasMasterCertificate(userId)) {
      this.awardMasterCertificate(userId);
      return true; // Newly awarded
    }
    return this.hasMasterCertificate(userId); // Already had it
  }

  /**
   * Check if user meets master certificate requirements (6 sections + 60% accuracy)
   */
  static meetsMasterCertificateRequirements(completedSections: number, overallAccuracy: number): boolean {
    return completedSections >= 6 && overallAccuracy >= 60;
  }

  /**
   * Get master certificate download count for analytics
   */
  static incrementMasterCertificateDownload(userId: string): void {
    try {
      const userCerts = this.getUserCertificates(userId);
      if (userCerts.masterCertificate) {
        if (!userCerts.masterCertificate.downloadCount) {
          userCerts.masterCertificate.downloadCount = 0;
        }
        userCerts.masterCertificate.downloadCount++;
        userCerts.masterCertificate.lastDownloadedAt = new Date().toISOString();
        
        localStorage.setItem(`${this.USER_CERTS_KEY}_${userId}`, JSON.stringify(userCerts));
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }

  /**
   * Export user certificate data (for backup/transfer)
   */
  static exportUserCertificates(userId: string): string {
    const userCerts = this.getUserCertificates(userId);
    return JSON.stringify(userCerts, null, 2);
  }

  /**
   * Import user certificate data (for backup/transfer)
   */
  static importUserCertificates(userId: string, certificateData: string): boolean {
    try {
      const userCerts = JSON.parse(certificateData) as UserCertificates;
      if (userCerts.userId === userId) {
        localStorage.setItem(`${this.USER_CERTS_KEY}_${userId}`, certificateData);
        
        // Update master certificate list if needed
        if (userCerts.masterCertificate && !this.hasMasterCertificate(userId)) {
          this.awardMasterCertificate(userId);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing certificates:', error);
      return false;
    }
  }
}

// Types for certificate management
export interface UserCertificates {
  userId: string;
  sectionCertificates: SectionCertificate[];
  masterCertificate: MasterCertificate | null;
}

export interface SectionCertificate {
  sectionNumber: number;
  earnedAt: string;
  completionData: SectionCompletionData;
  isPermanent: boolean;
  downloadCount?: number;
  lastDownloadedAt?: string;
}

export interface MasterCertificate {
  earnedAt: string;
  userId: string;
  isPermanent: boolean;
  downloadCount?: number;
  lastDownloadedAt?: string;
}

export interface SectionCompletionData {
  accuracy: number;
  questionsCorrect: number;
  totalQuestions: number;
  timeSpent: number;
  score: number;
  completedAt: string;
} 