use anchor_lang::prelude::*;

declare_id!("HVGvQSXwVwRZqYHoBEHCfVC1HNhgE7BDa2w5vmUmrXQL");

#[program]
pub mod solana_chat {

    use super::*;

    pub fn create_message(
        ctx: Context<CreateMessage>,
        text: String
    ) -> Result<()> {

        let message = &mut ctx.accounts.message;
        let clock: Clock = Clock::get().unwrap();

        message.owner = ctx.accounts.user.key();
        message.text = text;
        message.timestamp = clock.unix_timestamp;

        Ok(())
    }

    pub fn update_message(
        ctx: Context<UpdateMessage>,
        text: String
    ) -> Result<()> {

        let message = &mut ctx.accounts.message;

        message.text = text;

        Ok(())
    }

    pub fn delete_message(
        ctx: Context<DeleteMessage>,
        text: String                    // It is necessary to pass any text to get a context.
    ) -> Result<()> {
        Ok(())
    }

}



#[derive(Accounts)]
#[instruction(text: String)]
pub struct CreateMessage<'info> {
    #[account(
        init,
        payer = user,
        space = 8  +                             // Discriminator Anchor
                32 +                             // Owner
                text.as_bytes().len() + 4 +      // Text + 4    (String prefix)
                8                                // Timestamp
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct UpdateMessage<'info> {
    #[account(
        mut,
        realloc = 8  +
                  32 +
                  text.as_bytes().len() + 4 +
                  8,
        realloc::payer = user,
        realloc::zero = true
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct DeleteMessage<'info> {
    #[account(
        mut,
        close = user
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct Message {
    pub owner: Pubkey,    // 32
    pub text: String,     // n + 4
    pub timestamp: i64,   // 8
}
